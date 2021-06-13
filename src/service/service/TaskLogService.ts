import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MongoRepository} from 'typeorm';
import {TaskLogEntity} from '../../model/entity/TaskLogEntity';
import {ApiException} from '../../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../../config/ApiErrorCodeEnum';
import {CreateLogDto} from '../../model/DTO/log/CreateLogDto';
import {LogGetDto} from '../../model/DTO/log/LogGetDto';
import { From, On} from "nest-event";
import {InsertResult} from "typeorm/query-builder/result/InsertResult";
import {TaskGetDto} from "../../model/DTO/task/TaskGetDto";

@Injectable()
export class TaskLogService {
    constructor(
        @InjectRepository(TaskLogEntity) private readonly taskLogEntityRepository: MongoRepository<TaskLogEntity>,
    ) {}

    /**
     * 查询全部的日志
     * @param query
     */
    public async getLogList(query: LogGetDto): Promise<any> {
        const pageSize = query.pageSize;
        const page = query.page;
        try {
            const queryConditionList = ['u.isDelete = :isDelete'];
            if (query.isSuccess || query.isSuccess === '0' || query.isSuccess === 0) {
                queryConditionList.push('u.isSuccess = :isSuccess');
            }
            if (query.endTime) {
                queryConditionList.push('u.endTime > :endTime');
            }
            if (query.to) {
                queryConditionList.push('u.to LIKE :to');
            }
            const queryCondition = queryConditionList.join(' AND ');
            const res = await this.taskLogEntityRepository
                .createQueryBuilder('u')
                .where(queryCondition, {
                    to: `%${query.to}%`,
                    isDelete: 0,
                    endTime: query.endTime,
                    isSuccess: query.isSuccess

                })
                .orderBy('u.endTime', 'DESC')
                .skip((page - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();
            return  { data: res[0], count: res[1]};
        } catch (e) {
            throw new ApiException('查询失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查询任务日志
     * @param params
     */
    public async getLogInfo(params: string) {
        try {
            return  await this.taskLogEntityRepository.findOne({where: {taskCode: params}});
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 任务日志记录
     */
    @From('task-log-emitter')
    @On('record-task-log')
    public async onSubscribeTaskLog(params: TaskLogEntity): Promise<InsertResult> {
        const logOptions: TaskLogEntity = params as TaskLogEntity;
        delete logOptions.id;
        return await this.taskLogEntityRepository.insert(logOptions);
    }
}
