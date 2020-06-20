import { Job, Queue } from 'bull';
import { RedisCacheService } from '../service/redisCache.service';
import { TaskEmitEmailService } from '../service/taskEmitEmail.service';
import { TaskLogService } from '../service/taskLog.service';
import { TaskEntity } from '../../model/mongoEntity/task.entity';
import { TaskService } from '../service/task.service';
export declare class NoticeEmailProcessor {
    private readonly emailNoticeQueue;
    private readonly redisCacheService;
    private readonly taskLogService;
    private readonly taskEmitEmailService;
    private readonly taskService;
    constructor(emailNoticeQueue: Queue, redisCacheService: RedisCacheService, taskLogService: TaskLogService, taskEmitEmailService: TaskEmitEmailService, taskService: TaskService);
    handleTranscode(job: Job): Promise<void>;
    protected nextLoopTak(task: TaskEntity, isSuccessFlag: boolean, status: number): Promise<void>;
}
