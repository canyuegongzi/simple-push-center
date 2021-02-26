/// <reference types="node" />
import { Job, Queue } from 'bull';
import { TaskLogService } from '../service/TaskLogService';
import { TaskEntity } from '../../model/mongoEntity/TaskEntity';
import { TaskService } from '../service/TaskService';
import { TaskEmitMessageService } from '../service/TaskEmitMessageService';
import { NestEventEmitter } from "nest-event";
import { EventEmitter } from "events";
export declare class MessageEmailProcessor extends EventEmitter {
    private readonly messageNoticeQueue;
    private readonly taskLogService;
    private readonly taskEmitMessageService;
    private readonly taskService;
    private readonly nestEventEmitter;
    constructor(messageNoticeQueue: Queue, taskLogService: TaskLogService, taskEmitMessageService: TaskEmitMessageService, taskService: TaskService, nestEventEmitter: NestEventEmitter);
    handleTranscode(job: Job): Promise<void>;
    protected nextLoopTak(task: TaskEntity, isSuccessFlag: boolean, status: number): Promise<void>;
}
