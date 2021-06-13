import {Injectable, Logger} from '@nestjs/common';
import {MailerTransport} from '../../model/types/MailerTransport';
import {SendMailerOptions} from '../../model/types/SendMailerOptions';
import * as nodemailer from 'nodemailer';
@Injectable()
export class TaskEmitEmailService {
     private readonly logger = new Logger(TaskEmitEmailService.name);
       constructor() {
           this.init();
       }

      /**
       * 构建传输器
       * @param mailerTransport
       */
     public async createTransport(mailerTransport: MailerTransport): Promise<MailerTransport> {
       try {
         return await nodemailer.createTransport({
           host: mailerTransport.host,
           service: mailerTransport.service, // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
           port: mailerTransport.port, // SMTP 端口
           secureConnection: mailerTransport.secureConnection, // 使用了 SSL
           auth: {user: mailerTransport.auth.user, pass: mailerTransport.auth.pass},
         });
       } catch (e) {
           throw  new Error(e);
       }

     }

     /**
      * 发送邮件
      */
     public async sendMailer(sendMailerOptions: SendMailerOptions, transporter: MailerTransport): Promise<{response: any, isSuccess: boolean}> {
         try {
             const response: any = await transporter.sendMail(sendMailerOptions);
             return { response, isSuccess: !!response.messageId };
         } catch (e) {
             return { response: e, isSuccess: false};
         }
     }

    /**
     * 邮箱推送任务启动
     */
    public init(): void {
         this.logger.debug('Start transcoding...');
     }
}
