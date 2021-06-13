import {Injectable, Logger} from '@nestjs/common';
import {MessageTransport} from '../../model/types/MessageTransport';
import {SendMessageOptions} from '../../model/types/SendMessageOptions';
import Dysmsapi, * as $Dysmsapi from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';

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
     public async createTransport(messageTransport: MessageTransport): Promise<any> {
       try {
           const config = new $OpenApi.Config({
               accessKeyId: messageTransport.accessKeyId,
               accessKeySecret: messageTransport.secretAccessKey
          });
          // 访问的域名
          // config.endpoint = "dysmsapi.aliyuncs.com";
          return new Dysmsapi(config);
       } catch (e) {
            throw new Error(e);
       }
     }

     /**
      * 发送邮件
      */
     public async sendMessage(sendMessageOptions: SendMessageOptions, transporter: MessageTransport): Promise<{ response:any, isSuccess: boolean }> {
         try {
             const sendSmsRequest = new $Dysmsapi.SendSmsRequest({
                 phoneNumbers: sendMessageOptions.PhoneNumbers,
                 signName: sendMessageOptions.SignName,
                 templateCode: sendMessageOptions.TemplateCode,
                 templateParam: sendMessageOptions.TemplateParam,
             });
             const response: any = await transporter.sendSms(sendSmsRequest)
             const isSuccess = response.body.code === 'OK'
             return { response, isSuccess};
         } catch (e) {
             return { response: e, isSuccess: false};
         }
     }

     public init(): void {
         this.logger.debug('Start transcoding...');
     }
}
