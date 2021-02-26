import {Injectable, Logger} from '@nestjs/common';
import {MailerTransport} from '../../model/types/MailerTransport';
import {SendMailerOptions} from '../../model/types/SendMailerOptions';
import SMSClient = require('@alicloud/sms-sdk');
import {MessageTransport} from '../../model/types/MessageTransport';
import {SendMessageOptions} from '../../model/types/SendMessageOptions';
@Injectable()
export class TaskEmitMessageService {
     private readonly logger = new Logger(TaskEmitMessageService.name);
       constructor() {
           this.init();
       }

      /**
       * 构建传输器
       * @param messageTransport
       */
     public async createTransport(messageTransport: MessageTransport) {
       try {
         const transporter: MessageTransport = await new SMSClient({accessKeyId: messageTransport.accessKeyId, secretAccessKey: messageTransport.secretAccessKey});
         return transporter;
       } catch (e) {
           throw  new Error(e);
       }

     }

     /**
      * 发送邮件
      */
     public async sendMessage(sendMessageOptions: SendMessageOptions, transporter: MessageTransport) {
         try {
             const response: any = await transporter.sendSMS({
                 PhoneNumbers: sendMessageOptions.PhoneNumbers,
                 SignName: sendMessageOptions.SignName,
                 TemplateCode: sendMessageOptions.TemplateCode,
                 TemplateParam: sendMessageOptions.TemplateParam,
             })
             const isSuccess = response.Code === 'OK'
             return { response, isSuccess};
         } catch (e) {
             return { response: e, isSuccess: false};
         }
     }

     public init() {
         this.logger.debug('Start transcoding...');
     }
}
