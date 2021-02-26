/// <reference types="node" />
import { Job, Queue } from 'bull';
import { TaskEmitEmailService } from '../service/TaskEmitEmailService';
import { TaskEntity } from '../../model/mongoEntity/TaskEntity';
import { TaskService } from '../service/TaskService';
import { NestEventEmitter } from "nest-event";
import { EventEmitter } from "events";
export declare class NoticeEmailProcessor extends EventEmitter {
    private readonly emailNoticeQueue;
    private readonly taskEmitEmailService;
    private readonly taskService;
    private readonly nestEventEmitter;
    constructor(emailNoticeQueue: Queue, taskEmitEmailService: TaskEmitEmailService, taskService: TaskService, nestEventEmitter: NestEventEmitter);
    handleTranscode(job: Job): Promise<void>;
    protected nextLoopTak(task: TaskEntity, isSuccessFlag: boolean, status: number): Promise<void>;
}
