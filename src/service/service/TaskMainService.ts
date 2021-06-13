import {Injectable} from '@nestjs/common';
import {AppTaskConfig} from "../../model/DTO/task/AppTaskConfig";
import {ApiException} from "../../common/error/exceptions/ApiException";
import {ApiErrorCode} from "../../config/ApiErrorCodeEnum";
import {InjectQueue} from "@nestjs/bull";
import {Job, Queue} from "bull";
import {UtilService} from "./UtilService";
import {RedisCacheService} from "./RedisCacheService";
import {SystemConfigEntity} from "../../model/entity/SystemConfigEntity";
import {InjectRepository} from "@nestjs/typeorm";
import {TaskEntity} from "../../model/entity/TaskEntity";
import {Repository, UpdateResult} from "typeorm";
import {EmailConfigEntity} from "../../model/entity/EmailConfigEntity";
import {MessageConfigEntity} from "../../model/entity/MessageConfigEntity";
import {CreateEmailTaskDto} from "../../model/DTO/task/CreateEmailTaskDto";
import {InsertResult} from "typeorm/browser";
import moment = require('moment');
import fnv = require('fnv-plus');
import {TaskGetDto} from "../../model/DTO/task/TaskGetDto";
import {From, On} from "nest-event";
import {KafkaTaskDto} from "../../model/DTO/kafka/KafkaTaskDto";
import {CancleEmailTaskDto} from "../../model/DTO/task/CancleEmailTaskDto";

moment.locale('zh-cn')


@Injectable()
export class TaskMainService {
    public appTaskConfig: AppTaskConfig = new AppTaskConfig();
    private resultMap =  {
        MAX_ING_TASK_ERR: '正在执行的任务达到峰值',
        MAX_MESSAGE_TOOT_CONFIG_NUM:  '短信推送体验账号达到峰值',
        MAX_EMAIL_TOOT_CONFIG_NUM: '邮件推送体验账号达到峰值'
    }
    constructor(
        @InjectQueue('email') private readonly emailNoticeQueue: Queue,
        @InjectQueue('message') private readonly messageNoticeQueue: Queue,
        private readonly utilService: UtilService,
        private readonly redisCacheService: RedisCacheService,
        @InjectRepository(TaskEntity) private readonly taskEntityRepository: Repository<TaskEntity>,
        @InjectRepository(EmailConfigEntity) private readonly emailConfigEntityRepository: Repository<EmailConfigEntity>,
        @InjectRepository(MessageConfigEntity) private readonly messageConfigEntityRepository: Repository<MessageConfigEntity>,
        @InjectRepository(SystemConfigEntity) private readonly systemConfigEntityRepository: Repository<SystemConfigEntity>,
    ) {
        this.init().then((res: any) => {
            this.appTaskConfig = res.systemConfig;
        }).catch(() => {
            this.appTaskConfig.MAX_ING_TASK = 20
            this.appTaskConfig.MAX_MESSAGE_TOOT_CONFIG_NUM = 5
            this.appTaskConfig.MAX_EMAIL_TOOT_CONFIG_NUM = 50
        })
    }


    /**
     * 系统初始化
     */
    public async init(): Promise<any> {
        const systemConfig: SystemConfigEntity = await this.systemConfigEntityRepository.findOne({CONFIG_NAME: 'LIMIT_CONFIG'});
        if(systemConfig) {
            await this.redisCacheService.set('LIMIt_CONFIG', systemConfig)
        }
        return {systemConfig}
    }


    /**
     * 鉴权能否继续提交任务到任务队列
     * @param key
     * @param expiresTime
     * @param taskType 1: 邮件  2 短信
     * @param token
     * @param submitType 1： 自己配置  2 自动配置
     */
    public async canSubmit(key: string, expiresTime: string, taskType: number, token: string, submitType: number): Promise<any> {
        try {
            const systemConfig = await this.redisCacheService.get('LIMIt_CONFIG');
            const user: Record<string, any> = await this.utilService.getUser(token);
            let count = await this.taskEntityRepository.count({status: 1});
            // 系统中运行的任务大于系统预设的最大任务数时，不允许再注入任务
            if (count >= systemConfig.MAX_ING_TASK) {
                return { flag: false, message: this.resultMap.MAX_ING_TASK_ERR}
            }
            // 临时用户注入任务时根据预设的最大允许任务数判断
            if (submitType === 2) {
                count = await this.taskEntityRepository.count({status: 2, operateUser: user.name, taskType: taskType});
                // 邮件
                if (taskType === 1 && count >= systemConfig.MAX_EMAIL_TOOT_CONFIG_NUM) {
                    return { flag: false, message: this.resultMap.MAX_EMAIL_TOOT_CONFIG_NUM}
                }
                // 短信
                if (taskType === 2 && count >= systemConfig.MAX_MESSAGE_TOOT_CONFIG_NUM) {
                    return { flag: false, message: this.resultMap.MAX_MESSAGE_TOOT_CONFIG_NUM}
                }
            }
            return { flag: true, message: 'ok'}
        }catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 创建邮件推送任务
     * @param params
     */
    public async addEmailTask<T>(params: CreateEmailTaskDto): Promise<Job<T>> {
        try {
            const config: EmailConfigEntity = await this.getEmailConfigInfo(params.taskConfig);
            const task: TaskEntity = this.buildTaskLog(params, 1, config);
            // 插入
            const taskResult: InsertResult = await this.taskEntityRepository.insert(task);
            const delayValue: number = task.predictDealTime - moment().valueOf();
            // 任务id
            const insertedId: number = taskResult.raw.insertId;
            // 延时判断  0: 立即执行任务（其实不是真正的及时任务）1: 延时任务
            switch (task.isDelay) {
                case 0:
                    return this.emailNoticeQueue.add('emitEmail', {
                        id: insertedId,
                        config: config.name,
                    }, { delay: 0});
                case 1:
                    return await this.emailNoticeQueue.add('emitEmail', {
                        id: insertedId,
                        config: config.name,
                    }, { delay: delayValue});
            }
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 开始一个短信任务
     * @param params
     */
    public async addMessageTask<T>(params: CreateEmailTaskDto) {
        try {
            const config: MessageConfigEntity = await this.getMessageConfigInfo(params.taskConfig);
            const task: any = this.buildTaskLog(params, 2, config);
            // 插入
            const taskResult: InsertResult = await this.taskEntityRepository.insert(task);
            const delayValue: number = task.predictDealTime - moment().valueOf();
            // // 任务id
            const insertedId: number = taskResult.raw.insertId;
            // 延时判断  0: 立即执行任务（其实不是真正的及时任务）1: 延时任务
            switch (task.isDelay) {
                case 0:
                    return await this.messageNoticeQueue.add('emitMessage', {id: insertedId, config: config.name}, { delay: 0});
                case 1:
                    return await this.messageNoticeQueue.add('emitMessage', {id: insertedId, config: config.name}, { delay: delayValue});
            }
        } catch (e) {
            console.log(e);
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 获取邮件配置
     * @param taskConfig
     */
    public async getEmailConfigInfo(taskConfig: string): Promise<EmailConfigEntity> {
        try {
            if (taskConfig) {
                return await this.emailConfigEntityRepository.findOne({name: taskConfig});
            } else {
                return await this.emailConfigEntityRepository.findOne({isDefault: 1});
            }
        } catch (e) {
            console.log(e);
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 获取短信配置信息
     * @param taskConfig
     */
    public async getMessageConfigInfo(taskConfig: string): Promise<MessageConfigEntity> {
        try {
            if (taskConfig) {
                return await this.messageConfigEntityRepository.findOne({name: taskConfig});
            } else {
                return await this.messageConfigEntityRepository.findOne({isDefault: 1});
            }
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 构建一条任务记录
     * @param params<CreateEmailTaskDto>
     * @param taskType<number>
     * @param config   MessageConfigEntity | EmailConfigEntity
     */
    private buildTaskLog(params: CreateEmailTaskDto, taskType = 1, config: any): any {
        return {
            operateUser: params.operateUser,
            name: params.name,
            taskConfig: params.taskConfig,
            taskCode: this.makeTaskCode(params),
            status: 0,
            taskType,
            executeType: params.executeType,
            executeCount: 0,
            isDelay: params.isDelay,
            startTime: moment().valueOf(),
            predictDealTime: this.getPredictDealTime(Number(params.isDelay), params),
            endTime: null,
            from: config.authUser || '云平台',
            to: params.to,
            content: params.content,
            title: params.title,
            timeType: params.timeType,
            timeValue: params.timeValue,
            maxExecuteCount: params.executeType === 1 ? 1 : params.maxExecuteCount,
        };
    }

    /**
     * 任务编号
     */
    public makeTaskCode(params: CreateEmailTaskDto): any {
        const value = `${moment().valueOf()}${params.operateUser}`;
        return fnv.hash(value, 16).str();
    }

    /**
     * 计算一下次执行时间（0: 不延时 1 ：延时）
     * @param isDelay
     * @param params
     */
    private getPredictDealTime(isDelay: number, params: CreateEmailTaskDto) {
        const executeType = Number(params.executeType);
        if (isDelay === 0) {
            return moment().valueOf();
        }
        if ((isDelay === 1 && executeType === 1)) {
            return Number(params.predictDealTime);
        }
        if (executeType === 2) {
            return this.getNextTimeValue(params.timeType, params.timeValue, 1);
        }
        return moment().valueOf();
    }

    /**
     * 计算下一次执行的时间
     * @param timeType
     * @param timeValue   day: HH:mm:00   hour: 01
     * @param isDelay
     */
    public getNextTimeValue(timeType: string, timeValue: string, isDelay: number): number {
        // 延时任务
        if (isDelay === 1) {
            // 小时时间类型
            if (timeType === 'hours') {
                return moment().add(1, 'hours').startOf('hour').valueOf();
            }
            // 天类型
            if (timeType === 'days') {
                return moment().add(1, 'days').startOf('day').valueOf();
            }
        }
        return null
    }

    /**
     * 查询
     * @param id
     */
    public async getTaskInfo(id: string): Promise<TaskEntity> {
        return await this.taskEntityRepository.findOne(id);
    }

    /**
     * 更新任务
     * @param id
     * @param task
     */
    public async updateTask(id: number, task: TaskEntity):  Promise<UpdateResult> {
        const newTask: TaskEntity = {...task};
        delete newTask.id;
        try {
            return this.taskEntityRepository
                .createQueryBuilder('u')
                .update(TaskEntity)
                .set({...task})
                .where({id: id})
                .execute();
        } catch (e) {
            throw new ApiException('编辑失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 任务列表
     * @param params
     */
    public async taskList(params: TaskGetDto): Promise<{ data:any, count: number }> {
        const pageSize = params.pageSize;
        const page = params.page;
        try {
            const queryConditionList = ['u.isDelete = :isDelete'];
            // 任务状态
            if (params.status) {
                queryConditionList.push('u.status = :status');
            }
            // 任务类型
            if (params.taskType) {
                queryConditionList.push('u.taskType = :taskType');
            }
            // 任务类型
            if (params.isDelay) {
                queryConditionList.push('u.isDelay = :isDelay');
            }
            // 任务类型
            if (params.endTime) {
                queryConditionList.push('u.isDelay > :isDelay');
            }
            if (params.from) {
                queryConditionList.push('u.from LIKE :from');
            }

            if (params.to) {
                queryConditionList.push('u.to LIKE :to');
            }
            const queryCondition = queryConditionList.join(' AND ');
            const res = await this.taskEntityRepository
                .createQueryBuilder('u')
                .where(queryCondition, {
                    to: `%${params.to}%`,
                    from: `%${params.from}%`,
                    status: Number(params.status),
                    taskType: Number(params.taskType),
                    isDelay: Number(params.isDelay),
                    endTime: Number(params.endTime),
                    isDelete: 0

                })
                .orderBy('u.startTime', 'DESC')
                .skip((page - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();
            return  { data: res[0], count: res[1]};
        } catch (e) {
            throw new ApiException('查询失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 删除任务
     * @param params
     */
    public async deleteTask(params: number): Promise<any> {
        return this.taskEntityRepository.delete(params);

    }

    /**
     * kafka任务处理
     */
    @From('task-kafka-emitter')
    @On('new-kafka-task')
    public async onSubscribeTaskLog(data: any): Promise<any> {
        try {
            const params: KafkaTaskDto = data.body;
            const taskType = Number(params.taskType);
            switch (taskType) {
                case 1:
                    return await this.addEmailTask(params);
                case 2:
                    return await this.addMessageTask(params);
            }
        }catch (e) {
            return null
        }
    }

    /**
     * 任务取消
     * @param params
     */
    public async cancleEmailTask(params: CancleEmailTaskDto): Promise<UpdateResult> {
        try {
            return this.taskEntityRepository
                .createQueryBuilder('u')
                .update(TaskEntity)
                .set({status: 4})
                .where({id: params.id})
                .execute();
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }
}
