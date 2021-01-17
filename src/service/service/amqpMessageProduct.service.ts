import {Inject, Injectable} from '@nestjs/common';
import moment = require('moment');
moment.locale('zh-cn')
import {AmqpConnection, RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {rabbitMQConfig} from "../../config/config.json";
import {RequestAddFriendDto} from "../../model/DTO/friend/requestAddFriend.dto";
import {WsFriendMessageInfo} from "../../model/DTO/ws/WsFriendMessageInfo";
import {AffirmChatMessageDto} from "../../model/DTO/message/AffirmChatMessageDto";

@Injectable()
export class AmqpMessageProductService{
    constructor(
        private readonly messageClient: AmqpConnection
    ) {}

    /**
     * 向全部微服务广播好友消息
     */
    public async sendFriendMessage(data: WsFriendMessageInfo) {
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
    public async sendGroupMessage(data: WsFriendMessageInfo) {
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

    /**
     * 聊天消息状态确认
     * @param data<AffirmChatMessageDto> 消息源数据
     */
    public async affirmChatMessage(data: AffirmChatMessageDto) {
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
