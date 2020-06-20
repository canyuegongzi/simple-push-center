import { Job, Queue } from 'bull';
import { TaskLogService } from '../service/taskLog.service';
import { TaskEntity } from '../../model/mongoEntity/task.entity';
import { TaskService } from '../service/task.service';
import { TaskEmitMessageService } from '../service/taskEmitMessage.service';
export declare class MessageEmailProcessor {
    private readonly messageNoticeQueue;
    private readonly taskLogService;
    private readonly taskEmitMessageService;
    private readonly taskService;
    constructor(messageNoticeQueue: Queue, taskLogService: TaskLogService, taskEmitMessageService: TaskEmitMessageService, taskService: TaskService);
    handleTranscode(job: Job): Promise<void>;
    protected nextLoopTak(task: TaskEntity, isSuccessFlag: boolean, status: number): Promise<void>;
}
