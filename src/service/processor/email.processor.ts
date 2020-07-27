import {InjectQueue, Process, Processor} from '@nestjs/bull';
import {Inject, Injectable} from '@nestjs/common';
import {Job, Queue} from 'bull';
import {RedisCacheService} from '../service/redisCache.service';
import {TaskEmitEmailService} from '../service/taskEmitEmail.service';
import {TaskLogService} from '../service/taskLog.service';
import {TaskEntity} from '../../model/mongoEntity/task.entity';
import {TaskService} from '../service/task.service';
import moment = require('moment');
moment.locale('zh-cn')
import {EmailConfigEntity} from '../../model/mongoEntity/emailConfig.entity';
import {Emitter, NestEventEmitter} from "nest-event";
import {EventEmitter} from "events";

@Injectable()
@Processor('email')
@Emitter('task-log-emitter')
export class NoticeEmailProcessor  extends EventEmitter {
    constructor(
        @InjectQueue('email') private readonly emailNoticeQueue: Queue,
        private readonly taskEmitEmailService: TaskEmitEmailService,
        @Inject(TaskService)
        private readonly taskService: TaskService,
        private readonly nestEventEmitter: NestEventEmitter,
    ) {
        super()
    }

    @Process('emitEmail')
    public async handleTranscode(job: Job) {
        let task: TaskEntity;
        let emailConfig: EmailConfigEntity;
        let errmessage = '';
        let status: number;
        let transport;
        let sendResult = null;
        let isSuccessFlag = false;
        try {
            task = await this.taskService.getTaskInfo(job.data.id);
            emailConfig = await this.taskService.getEmailConfigInfo(task.taskConfig);
            if (task.executeCount >= task.maxExecuteCount || (Number(task.executeType) === 1 && Number(task.status) === 2) || (Number(task.executeType) === 2 && Number(task.status) >= 2)) { return; }
            try {
                transport = await this.taskEmitEmailService.createTransport({
                    port: emailConfig.port,
                    host: emailConfig.host && emailConfig.host !== '--' ? emailConfig.host : '',
                    secureConnection: false,
                    service: emailConfig.service,
                    auth: {user: emailConfig.authUser, pass: emailConfig.authPass}});
            } catch (e) {
                errmessage = '传输器构建失败';
            }
        } catch (e) {
            status = 3;
            errmessage = '任务查询失败或获取配置失败';
        }
        try {
            const {response, isSuccess} = await this.taskEmitEmailService.sendMailer({to: task.to, from: emailConfig.authUser, subject: task.title, html: task.content}, transport);
            errmessage = isSuccess ? '推送成功' : '邮件发送失败';
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
            errmessage = '邮件发送失败';
        }
        this.nestEventEmitter.emitter('task-log-emitter').emit('record-task-log', {isSuccess: isSuccessFlag, taskCode: task.taskCode, logging: sendResult, content: task.content, from: task.from, to: task.to, errmessage, endTime: moment().valueOf(), taskId: task.id });
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
                delayValue = nextTime - moment().valueOf();
                newTask = {...task, executeCount: task.executeCount + 1, predictDealTime: nextTime, status, endTime: moment().valueOf()};
            } else {
                newTask = {...task, executeCount: task.executeCount + 1, status, endTime: moment().valueOf()};
            }
            await this.taskService.updateTask(newTask.id, newTask);
            if (task.executeCount >= task.maxExecuteCount || (executeType === 1 && task.status === 2) || (executeType === 2 && task.status >= 2)) {
                return;
            } else  {
                await this.emailNoticeQueue.add('emitEmail', {
                    id: newTask.id,
                    config: newTask.taskConfig,
                }, { delay: delayValue});
            }
        } catch (e) {
            console.log(e);
        }
    }
}
