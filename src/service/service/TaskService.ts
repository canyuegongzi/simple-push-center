import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {MongoRepository, ObjectID} from 'typeorm';
import {EmailConfigEntity} from '../../model/mongoEntity/EmailConfigEntity';
import {InjectRepository} from '@nestjs/typeorm';
import {TaskEntity} from '../../model/mongoEntity/TaskEntity';
import {CancleEmailTaskDto} from '../../model/DTO/task/CancleEmailTaskDto';
import {CreateEmailTaskDto} from '../../model/DTO/task/CreateEmailTaskDto';
import {InjectQueue, Process, Processor} from '@nestjs/bull';
import {Job, Queue} from 'bull';
import moment = require('moment');
moment.locale('zh-cn')
import fnv = require('fnv-plus');
import {ApiException} from '../../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../../config/ApiErrorCodeEnum';
import {TaskGetDto} from '../../model/DTO/task/TaskGetDto';
import {MessageConfigEntity} from '../../model/mongoEntity/MessageConfigEntity';
import {AppTaskConfig} from '../../model/DTO/task/AppTaskConfig';
import {TaskLogService} from './TaskLogService';
import {UniqueKey} from '../../model/DTO/config/UniqueKey';
import {UtilService} from "./UtilService";
import { SystemConfigEntity } from 'src/model/mongoEntity/SystemConfigEntity';
import {RedisCacheService} from "./RedisCacheService";
import {From, On} from "nest-event";
import {TaskLogEntity} from "../../model/mongoEntity/TaskLogEntity";
import {KafkaTaskDto} from "../../model/DTO/kafka/KafkaTaskDto";

@Injectable()
export class TaskService {
    public appTaskConfig: AppTaskConfig = new AppTaskConfig();
    private resultMap =  {
        MAX_ING_TASK_ERR: '正在执行的任务达到峰值',
        MAX_MESSAGE_TOOT_CONFIG_NUM:  '短信推送体验账号达到峰值',
        MAX_EMAIL_TOOT_CONFIG_NUM: '邮件推送体验账号达到峰值'
    }
    constructor(
        @InjectQueue('email') private readonly emailNoticeQueue: Queue,
        @InjectQueue('message') private readonly messageNoticeQueue: Queue,
        private readonly taskLogService: TaskLogService,
        private readonly utilService: UtilService,
        private readonly redisCacheService: RedisCacheService,
        @InjectRepository(TaskEntity) private readonly taskEntityRepository: MongoRepository<TaskEntity>,
        @InjectRepository(EmailConfigEntity) private readonly emailConfigEntityRepository: MongoRepository<EmailConfigEntity>,
        @InjectRepository(MessageConfigEntity) private readonly messageConfigEntityRepository: MongoRepository<MessageConfigEntity>,
        @InjectRepository(SystemConfigEntity) private readonly systemConfigEntityRepository: MongoRepository<SystemConfigEntity>,
        ) {
        this.init().then((res: any) => {
            this.appTaskConfig = res.systemConfig;
        }).catch((e) => {
            this.appTaskConfig.MAX_ING_TASK = 20
            this.appTaskConfig.MAX_MESSAGE_TOOT_CONFIG_NUM = 5
            this.appTaskConfig.MAX_EMAIL_TOOT_CONFIG_NUM = 50
        })
    }

    /**
     * 取消任务
     * @param params
     */
    public async cancleEmailTask(params: CancleEmailTaskDto) {
        try {
            return await this.taskEntityRepository.updateOne( {taskCode: params.taskCode }, { $set: {status: 4} });
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 开始一个邮件任务
     * @param params
     */
    public async addEmailTask(params: CreateEmailTaskDto) {
        try {
            const config: EmailConfigEntity = await this.getEmailConfigInfo(params.taskConfig);
            const task: any = this.buildTaskLog(params, 1, config);
            const taskResult = await this.taskEntityRepository.insertOne( task);
            const delayValue: number = task.predictDealTime - moment().valueOf();
            if (task.isDelay === '0') {
                await this.emailNoticeQueue.add('emitEmail', {
                    id: taskResult.insertedId,
                    config: config.name,
                }, { delay: 0});
            } else if (task.isDelay === '1') {
                await this.emailNoticeQueue.add('emitEmail', {
                    id: taskResult.insertedId,
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
    public async addMessageTask(params: CreateEmailTaskDto) {
        try {
            const config: MessageConfigEntity = await this.getMessageConfigInfo(params.taskConfig);
            const task: any = this.buildTaskLog(params, 2, config);
            const taskResult = await this.taskEntityRepository.insertOne( task);
            const delayValue: number = task.predictDealTime - moment().valueOf();
            if (task.isDelay === '0') {
                await this.messageNoticeQueue.add('emitMessage', {
                    id: taskResult.insertedId,
                    config: config.name,
                }, { delay: 0});
            } else if (task.isDelay === '1') {
                await this.messageNoticeQueue.add('emitMessage', {
                    id: taskResult.insertedId,
                    config: config.name,
                }, { delay: delayValue});
            }

        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 构建一条任务记录
     * @param params
     * @param config   MessageConfigEntity | EmailConfigEntity
     */
    public buildTaskLog(params: CreateEmailTaskDto, taskType = 1, config: any) {
        const task: TaskEntity = {
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
        return task;
    }

    /**
     * 计算一下次执行时间（0: 不延时 1 ：延时）
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
            const value = this.getNextTimeValue(params.timeType, params.timeValue, 1);
            return value;
        }
        return moment().valueOf();
    }

    /**
     * 任务编号
     */
    private makeTaskCode(params: CreateEmailTaskDto) {
        const value = `${moment().valueOf()}${params.operateUser}`;
        const hash = fnv.hash(value, 16).str();
        return hash;
    }

    /**
     * 查询
     * @param id
     */
    public async getTaskInfo(id: string) {
        return await this.taskEntityRepository.findOne(id);
    }

    /**
     * 更新任务
     * @param id
     */
    public async updateTask(id: string, task: TaskEntity) {
        const newTask: TaskEntity = {...task};
        delete newTask.id;
        try {
            await this.taskEntityRepository.updateOne( { _id: id }, { $set: newTask }, { upsert: true } );
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 计算下一次执行的时间
     * @param timeType
     * @param timeValue   day: HH:mm:00   hour: 01
     * @param isDelay
     */
    public getNextTimeValue(timeType: string, timeValue: string, isDelay: number) {
        const value: any | number | null = null;
        if (isDelay === 1) {
            if (timeType === 'hours') {
                const timeStr = moment().add(1, 'hours').startOf('hour').format('YYYY-MM-DD HH');
                const newTimeStr = `${timeStr}:${timeValue}:00`;
                return moment(newTimeStr).valueOf();
            }
            if (timeType === 'days') {
                const timeStr = moment().add(1, 'days').startOf('day').format('YYYY-MM');
                const newTimeStr = `${timeStr} ${timeValue}`;
                return moment(newTimeStr).valueOf();
            }
        }
    }

    /**
     * 加载任务列表
     * @param params
     */
    public async taskList(params: TaskGetDto) {
        const queryObg: any = {};
        const pageSize = Number(params.pageSize);
        const page = Number(params.page);
        if (params.status || params.status === '0') {queryObg.status = Number(params.status); }
        if (params.from) {queryObg.from = {$regex: params.from, $options: 'gi'}; }
        if (params.to) {queryObg.to = {$regex: params.to, $options: 'gi'}; }
        if (params.taskType || params.taskType === '0') {queryObg.taskType = Number(params.taskType); }
        if (params.isDelay || params.isDelay === '0') {queryObg.isDelay = params.isDelay; }
        if (params.endTime) {queryObg.endTime = { $gt: Number(params.endTime) }; }
        try {
            return  await this.taskEntityRepository.findAndCount({skip: (page - 1) * pageSize, order: {endTime: 'DESC'}, take: pageSize, where: queryObg});
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 删除任务
     * @param params
     */
    public async deleteTask(params: string) {
        try {
            return  await this.taskEntityRepository.deleteOne({taskCode: params});
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 鉴权能否继续提交任务到任务队列
     * @param key
     * @param expiresTime
     * @param taskType 1: 邮件  2 短信
     * @param submitType 1： 自己配置  2 自动配置
     */
    public async canSubmit(key, expiresTime, taskType = '1', token, submitType) {
        let user = null;
        let systemConfig: AppTaskConfig;
        try {
            systemConfig = await this.redisCacheService.get('LIMIt_CONFIG')
        }catch (e) {
            systemConfig = this.appTaskConfig
        }
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return { flag: false, message: '用户无效'}
        }
        try {
            let count = 0;
            count = await this.taskEntityRepository.count({status: 1});
            if (count >= systemConfig.MAX_ING_TASK) {
                return { flag: false, message: this.resultMap.MAX_ING_TASK_ERR}
            }
            if (Number(submitType) === 2) {
                count = await this.taskEntityRepository.count({status: 2, operateUser: user.name, taskType: Number(taskType)});
                if (Number(taskType) === 1 && count >= systemConfig.MAX_EMAIL_TOOT_CONFIG_NUM) {
                    return { flag: false, message: this.resultMap.MAX_EMAIL_TOOT_CONFIG_NUM}
                }
                if (Number(taskType) === 2 && count >= systemConfig.MAX_MESSAGE_TOOT_CONFIG_NUM) {
                    return { flag: false, message: this.resultMap.MAX_MESSAGE_TOOT_CONFIG_NUM}
                }
            }
            return { flag: true, message: 'ok'}
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 获取邮件配置
     * @param params
     */
    public async getEmailConfigInfo(taskConfig: string) {
        try {
            if (taskConfig) {
                return await this.emailConfigEntityRepository.findOne({name: taskConfig});
            } else {
                return await this.emailConfigEntityRepository.findOne({isDefault: 1});
            }
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 获取短信配置
     * @param params
     */
    public async getMessageConfigInfo(taskConfig: string) {
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
     * 唯一性
     * @param params
     */
    public async uniqueName(params: UniqueKey) {
        try {
            const queryObj: any = {};
            if (params.name) {queryObj.name = params.name; }
            if (params.email) {queryObj.email = params.email; }
            let result = null;
            if (params.type === 'email') {
                result = await this.emailConfigEntityRepository.findOne(queryObj);
            } else if (params.type === 'message') {
                result = await this.messageConfigEntityRepository.findOne(queryObj);
            }
            return !!!result;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 系统初始化
     */
    public async init() {
        const systemConfig: SystemConfigEntity = await this.systemConfigEntityRepository.findOne({CONFIG_NAME: 'LIMIT_CONFIG'});
        if(systemConfig) {
            await this.redisCacheService.set('LIMIt_CONFIG', systemConfig)
        }
        return {systemConfig}
    }

    /**
     * 任务日志记录(訂閱事件）发
     */
    @From('task-kafka-emitter')
    @On('new-kafka-task')
    public async onSubscribeTaskLog(data: any) {
        try {
            const params: KafkaTaskDto = data. body
            const taskType: number = params.taskType;
            if (Number(taskType) === 1) {
                try {
                    return await this.addEmailTask(params);
                }catch (e) {
                    console.log(e)
                }

            }
            if (Number(taskType) === 2) {
                return await this.addMessageTask(params);
            }
        }catch (e) {
            return null
        }
    }
}
