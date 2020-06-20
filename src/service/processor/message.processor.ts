import {InjectQueue, Process, Processor} from '@nestjs/bull';
import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {Job, Queue} from 'bull';
import {TaskLogService} from '../service/taskLog.service';
import {TaskEntity} from '../../model/mongoEntity/task.entity';
import {TaskService} from '../service/task.service';
import moment = require('moment');
import {TaskEmitMessageService} from '../service/taskEmitMessage.service';
import {MessageConfigEntity} from '../../model/mongoEntity/messageConfig.entity';

@Injectable()
@Processor('message')
export class MessageEmailProcessor {
    constructor(
        @InjectQueue('message') private readonly messageNoticeQueue: Queue,
        private readonly taskLogService: TaskLogService,
        private readonly taskEmitMessageService: TaskEmitMessageService,
        @Inject(TaskService)
        private readonly taskService: TaskService,
    ) {}

    @Process('emitMessage')
    public async handleTranscode(job: Job) {
        let task: TaskEntity;
        let messageConfig: MessageConfigEntity;
        let errmessage: string = '';
        let status: number;
        let transport;
        let sendResult = null;
        let isSuccessFlag = false;
        try {
            task = await this.taskService.getTaskInfo(job.data.id);
            messageConfig = await this.taskService.getMessageConfigInfo(task.taskConfig);
            if (task.executeCount >= task.maxExecuteCount || (Number(task.executeType) === 1 && Number(task.status) === 2) || (Number(task.executeType) === 2 && Number(task.status) >= 2)) { return; }
        } catch (e) {
            status = 3;
            errmessage = '任务查询失败或获取配置失败';
        }
        try {
            transport = await this.taskEmitMessageService.createTransport({accessKeyId: messageConfig.accessKeyId, secretAccessKey: messageConfig.secretAccessKey});
        } catch (e) {
            errmessage = '传输器构建失败';
        }
        try {
            const {response, isSuccess} =  await this.taskEmitMessageService.sendMessage({PhoneNumbers: task.to, SignName: messageConfig.signName, TemplateCode: messageConfig.templateCode, TemplateParam: task.content}, transport);
            errmessage = isSuccess ? '推送成功' : '短信发送失败';
            isSuccessFlag = isSuccess;
            sendResult = response;
            if (isSuccessFlag) {
                if (Number(task.executeType) === 1) {status = 2; }
                if (Number(task.executeType) === 2) {
                    status = task.executeCount === (task.maxExecuteCount - 1)  ? 2 : 1;
                  }
            } else {
                status = 3;
            }
            await this.nextLoopTak(task, isSuccessFlag, status);
        } catch (e) {
            errmessage = '短信发送失败';
        }
        await this.taskLogService.addTaskLog({isSuccess: isSuccessFlag, taskCode: task.taskCode, logging: sendResult, content: task.content, from: task.from, to: task.to, errmessage, endTime: moment().valueOf(), taskId: task.id });
    }

    /**
     * 下一步执行任务
     */
    protected async nextLoopTak(task: TaskEntity, isSuccessFlag: boolean, status: number) {
        try {
            const executeType = Number(task.executeType);
            let nextTime;
            let delayValue;
            let newTask: TaskEntity;
            if (executeType === 2) {
                nextTime = this.taskService.getNextTimeValue(task.timeType, task.timeValue, 1);
                delayValue = nextTime - new Date().getTime();
                newTask = {...task, executeCount: task.executeCount + 1, predictDealTime: nextTime, status, endTime: moment().valueOf()};
            } else {
                newTask = {...task, executeCount: task.executeCount + 1, status, endTime: moment().valueOf()};
            }
            await this.taskService.updateTask(newTask.id, newTask);
            if (task.executeCount >= task.maxExecuteCount || (executeType === 1 && task.status === 2) || (executeType === 2 && task.status >= 2)) {
                return;
            } else  {
                await this.messageNoticeQueue.add('emitMessage', {
                    id: newTask.id,
                    config: newTask.taskConfig,
                }, { delay: delayValue});
            }
        } catch (e) {
            console.log(e);
        }
    }
}
