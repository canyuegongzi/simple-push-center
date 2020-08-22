import {Inject, Injectable} from '@nestjs/common';
import moment = require('moment');
moment.locale('zh-cn')
import {AmqpConnection, RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {rabbitMQConfig} from "../../config/config.json";

@Injectable()
export class AmqpMessageProductService{
    constructor(
        private readonly messageClient: AmqpConnection
    ) {}

    /**
     * 发送消息
     */
    public async sendFriendMessage(data: any) {
        return new Promise((async (resolve, reject) => {
            try {
                this.messageClient.publish(rabbitMQConfig.websocketFriendMessageSubscribe, 'subscribe-friend-route', JSON.stringify(data));
                resolve({success: true, data: data})
                console.log('消息向IM服务广播success')
            }catch (e) {
                console.log(e);
                reject({ success:false, e})
            }
        }))
    }

    /**
     * 发送消息
     */
    public async sendGroupMessage(data: any) {
        return new Promise((async (resolve, reject) => {
            try {
                await this.messageClient.publish(rabbitMQConfig.websocketGroupMessageSubscribe, 'subscribe-group-route', JSON.stringify(data));
                resolve({success: true, data: data})
            }catch (e) {
                console.log(e);
                reject({ success:false, e})
            }
        }))
    }
}
