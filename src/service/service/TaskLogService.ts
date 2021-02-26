import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MongoRepository} from 'typeorm';
import {TaskLogEntity} from '../../model/mongoEntity/TaskLogEntity';
import {ApiException} from '../../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../../config/ApiErrorCodeEnum';
import {CreateLogDto} from '../../model/DTO/log/CreateLogDto';
import {LogGetDto} from '../../model/DTO/log/LogGetDto';
import { From, On} from "nest-event";

@Injectable()
export class TaskLogService {
    constructor(
        @InjectRepository(TaskLogEntity) private readonly taskLogEntityRepository: MongoRepository<TaskLogEntity>,
    ) {}

    /**
     * 插入日志
     * @param params
     */
    public async addTaskLog(params: CreateLogDto) {
        try {
            const logOptions: TaskLogEntity = params as TaskLogEntity;
            delete logOptions.id;
            return await this.taskLogEntityRepository.insertOne(logOptions);
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 查询全部的日志
     * @param params
     */
    public async getLogList(params: LogGetDto) {
        const pageSize = Number(params.pageSize);
        const page = Number(params.page);
        const isSuccess = Boolean(params.isSuccess);
        const queryObg: any = {};
        if (params.isSuccess || params.isSuccess === '0') {queryObg.isSuccess = isSuccess; }
        if (params.to) {queryObg.to = {$regex: params.to, $options: 'gi'}; }
        if (params.endTime) {queryObg.endTime = { $gt: Number(params.endTime) }; }
        try {
            return  await this.taskLogEntityRepository.findAndCount({skip: (page - 1) * pageSize, order: {endTime: 'DESC'}, take: pageSize, where: queryObg});
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 查询任务日志
     * @param params
     */
    public async getLogInfo(params: string) {
        try {
            return  await this.taskLogEntityRepository.findAndCount({where: {taskCode: params}});
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 任务日志记录
     */
    @From('task-log-emitter')
    @On('record-task-log')
    public async onSubscribeTaskLog(params: TaskLogEntity) {
        const logOptions: TaskLogEntity = params as TaskLogEntity;
        delete logOptions.id;
        return await this.taskLogEntityRepository.insertOne(logOptions);
    }
}
