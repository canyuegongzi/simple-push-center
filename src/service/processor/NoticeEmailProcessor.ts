import {InjectQueue, Process, Processor} from '@nestjs/bull';
import {Inject, Injectable} from '@nestjs/common';
import {Job, Queue} from 'bull';
import {TaskEmitEmailService} from '../service/TaskEmitEmailService';
import {TaskEntity} from '../../model/entity/TaskEntity';
import moment = require('moment');
moment.locale('zh-cn')
import {EmailConfigEntity} from '../../model/entity/EmailConfigEntity';
import {Emitter, NestEventEmitter} from "nest-event";
import {EventEmitter} from "events";
import {TaskMainService} from "../service/TaskMainService";
import Util from "@alicloud/tea-util";
import * as $tea from "@alicloud/tea-typescript";

@Injectable()
@Processor('email')
@Emitter('task-log-emitter')
export class NoticeEmailProcessor  extends EventEmitter {
    constructor(
        @InjectQueue('email') private readonly emailNoticeQueue: Queue,
        private readonly taskEmitEmailService: TaskEmitEmailService,
        @Inject(TaskMainService) private readonly taskService: TaskMainService,
        private readonly nestEventEmitter: NestEventEmitter,
    ) {
        super()
    }

    /**
     * 邮件处理任务 -----> 任务处理完成后需要查询任务信息，看是否完整的结束任务， 未完成的话再次向任务队列中注入任务
     * @param job
     */
    @Process('emitEmail')
    public async handleTranscode(job: Job): Promise<any> {
        let task: TaskEntity;
        let emailConfig: EmailConfigEntity;
        let errMessage = '';
        let status: number;
        let transport;
        let sendResult = null;
        let isSuccessFlag = false;
        try {
            // 查询任务信息
            task = await this.taskService.getTaskInfo(job.data.id);
            // 邮件推送配置信息
            emailConfig = await this.taskService.getEmailConfigInfo(task.taskConfig);
            console.log(emailConfig);
            // executeCount (已经执行的次数) 大于 任务的执行次数   executeType 执行类型，1： 单次 2：status 执行完成
            if (task.executeCount >= task.maxExecuteCount || (task.executeType === 1 && task.status === 2) || (task.executeType === 2 && task.status >= 2)) { return; }
            try {
                transport = await this.taskEmitEmailService.createTransport({port: emailConfig.port, host: emailConfig.host? emailConfig.host : '', secureConnection: emailConfig.secure, service: emailConfig.service, auth: {user: emailConfig.authUser, pass: emailConfig.authPass}});
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
            const {response, isSuccess} = await this.taskEmitEmailService.sendMailer({to: task.to, from: emailConfig.authUser, subject: task.title, html: task.content}, transport);
            errMessage = isSuccess ? '推送成功' : '邮件发送失败';
            isSuccessFlag = isSuccess;
            sendResult = response;
            if (isSuccessFlag) {
                // 执行类型  单次
                if (task.executeType === 1) {
                    // 任务标记完成
                    status = 2;
                }
                // 执行类型  循环
                if (task.executeType === 2) {
                    // 已经执行的次数 === 任务的最大允许次数 时标记任务完成
                    status = task.executeCount === (task.maxExecuteCount - 1)  ? 2 : 1;
                  }
            } else {
                // 任务直接标记失败
                status = 3;
            }
            await this.nextLoopTak(task, isSuccessFlag, status);
        } catch (e) {
            errMessage = '邮件发送失败';
        }
        // 日志处置
        this.nestEventEmitter.emitter('task-log-emitter').emit('record-task-log', {isSuccess: isSuccessFlag, taskCode: task.taskCode, logging: Util.toJSONString($tea.toMap(sendResult)), content: task.content, from: task.from, to: task.to, errMessage, endTime: moment().valueOf(), taskId: task.id });
    }

    /**
     * 下一步执行任务
     * @param task<TaskEntity> 任务实体
     * @param isSuccessFlag<boolean> 任务是否成功
     * @param status<number> 任务状态
     * @protected
     */
    protected async nextLoopTak(task: TaskEntity, isSuccessFlag: boolean, status: number): Promise<any> {
        try {
            const executeType: number = task.executeType;
            let nextTime: number;
            let delayValue: number;
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
            }
            await this.emailNoticeQueue.add('emitEmail', { id: newTask.id, config: newTask.taskConfig }, { delay: delayValue});
        } catch (e) {
            console.log(e);
        }
    }
}
