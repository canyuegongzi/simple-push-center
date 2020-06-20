import { MongoRepository } from 'typeorm';
import { TaskLogEntity } from '../../model/mongoEntity/taskLog.entity';
import { CreateLogDto } from '../../model/DTO/log/CreateLogDto';
import { LogGetDto } from '../../model/DTO/log/LogGetDto';
export declare class TaskLogService {
    private readonly taskLogEntityRepository;
    constructor(taskLogEntityRepository: MongoRepository<TaskLogEntity>);
    addTaskLog(params: CreateLogDto): Promise<import("typeorm").InsertOneWriteOpResult>;
    getLogList(params: LogGetDto): Promise<[TaskLogEntity[], number]>;
    getLogInfo(params: string): Promise<[TaskLogEntity[], number]>;
}
