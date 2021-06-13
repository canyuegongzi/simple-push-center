import {InjectQueue, Process, Processor} from '@nestjs/bull';
import { Inject, Injectable} from '@nestjs/common';
import {Job, Queue} from 'bull';
import {TaskLogService} from '../service/TaskLogService';
import {TaskEntity} from '../../model/entity/TaskEntity';
import moment = require('moment');
moment.locale('zh-cn');
import {TaskEmitMessageService} from '../service/TaskEmitMessageService';
import {MessageConfigEntity} from '../../model/entity/MessageConfigEntity';
import {Emitter, NestEventEmitter} from "nest-event";
import {EventEmitter} from "events";
import {TaskMainService} from "../service/TaskMainService";
import Util from "@alicloud/tea-util";
import * as $tea from "@alicloud/tea-typescript";

@Injectable()
@Processor('message')
@Emitter('task-log-emitter')
export class NoticeMessageProcessor extends EventEmitter {
    constructor(
        @InjectQueue('message') private readonly messageNoticeQueue: Queue,
        private readonly taskLogService: TaskLogService,
        @Inject(TaskMainService) private readonly taskService: TaskMainService,
        private readonly taskEmitMessageService: TaskEmitMessageService,
        private readonly nestEventEmitter: NestEventEmitter,
    ) {
        super()
    }

    @Process('emitMessage')
    public async handleTranscode(job: Job): Promise<any> {
        let task: TaskEntity;
        let messageConfig: MessageConfigEntity;
        let errMessage = '';
        let status: number;
        let transport;
        let sendResult = null;
        let isSuccessFlag = false;
        try {
            task = await this.taskService.getTaskInfo(job.data.id);
            messageConfig = await this.taskService.getMessageConfigInfo(task.taskConfig);
            if (task.executeCount >= task.maxExecuteCount || (task.executeType === 1 && task.status === 2) || (task.executeType === 2 && task.status >= 2)) { return; }
            try {
                transport = await this.taskEmitMessageService.createTransport({accessKeyId: messageConfig.accessKeyId, secretAccessKey: messageConfig.secretAccessKey});
            } catch (e) {
                console.log(e);
                errMessage = '传输器构建失败';
            }
        } catch (e) {
            console.log(e);
            status = 3;
            errMessage = '任务查询失败或获取配置失败';
        }
        try {
            const {response, isSuccess} =  await this.taskEmitMessageService.sendMessage({PhoneNumbers: task.to, SignName: messageConfig.signName, TemplateCode: messageConfig.templateCode, TemplateParam: task.content}, transport);
            errMessage = isSuccess ? '推送成功' : '短信发送失败';
            isSuccessFlag = isSuccess;
            sendResult = response;
            if (isSuccessFlag) {
                if (task.executeType === 1) {
                    status = 2;
                }
                if (task.executeType === 2) {
                    status = task.executeCount === (task.maxExecuteCount - 1)  ? 2 : 1;
                }
            } else {
                status = 3;
            }
            await this.nextLoopTak(task, isSuccessFlag, status);
        } catch (e) {
            console.log(e);
            errMessage = '短信发送失败';
        }
        this.nestEventEmitter.emitter('task-log-emitter').emit('record-task-log', {isSuccess: isSuccessFlag, taskCode: task.taskCode, logging: Util.toJSONString($tea.toMap(sendResult)), content: task.content, from: task.from, to: task.to, errMessage, endTime: moment().valueOf(), taskId: task.id });
    }

    /**
     * 下一步执行任务
     */
    protected async nextLoopTak(task: TaskEntity, isSuccessFlag: boolean, status: number): Promise<any> {
        try {
            const executeType = task.executeType;
            let nextTime;
            let delayValue;
            let newTask: TaskEntity;
            if (executeType === 2) {
                nextTime = this.taskService.getNextTimeValue(task.timeType, task.timeValue, 1);
                delayValue = nextTime - moment().valueOf();
                newTask = {...task, executeCount: task.executeCount + 1, predictDealTime: nextTime, status, endTime: moment().valueOf()};
            } else {
                newTask = {...task, executeCount: task.executeCount + 1, status, endTime: moment().valueOf()};
            }
            await this.taskService.updateTask(newTask.id, newTask);
            if (newTask.executeCount >= task.maxExecuteCount || (executeType === 1 && task.status === 2) || (executeType === 2 && task.status >= 2)) {
                return;
            } else  {
                await this.messageNoticeQueue.add('emitMessage', {id: newTask.id, config: newTask.taskConfig}, { delay: delayValue});
            }
        } catch (e) {
            console.log(e);
        }
    }
}
