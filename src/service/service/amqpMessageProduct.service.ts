import {Inject, Injectable} from '@nestjs/common';
import moment = require('moment');
moment.locale('zh-cn')
import {AmqpConnection, RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {rabbitMQConfig} from "../../config/config.json";
import {RequestAddFriendDto} from "../../model/DTO/friend/requestAddFriend.dto";

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
                await this.messageClient.publish(rabbitMQConfig.websocketFriendMessageSubscribe, 'friend-route', JSON.stringify(data));
                resolve({success: true, data: data})
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

    /**
     * 好友请求
     * @param amqpMessageDto
     */
    public async newRequest(data: RequestAddFriendDto) {
        console.log('有一个新的请求了');
        console.log(data);
        return new Promise((async (resolve, reject) => {
            try {
                await this.messageClient.publish(rabbitMQConfig.websocketRequestExchange, 'new-request', JSON.stringify(data));
                resolve({success: true, data: data})
            }catch (e) {
                console.log(e);
                reject({ success:false, e})
            }
        }))
    }
}
