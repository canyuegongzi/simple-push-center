import {Inject, Injectable} from '@nestjs/common';
import moment = require('moment');
import {KafkaPayload} from "../../common/kafka/kafka.message";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {rabbitMQConfig} from "../../config/config.json";
import {AmqpMessageProductService} from "./amqpMessageProduct.service";
moment.locale('zh-cn')

@Injectable()
export class AmqpMessageConsumerService {

    constructor(
        @Inject(AmqpMessageProductService) private readonly amqpMessageProductService: AmqpMessageProductService,
    ) {}

    @RabbitRPC({
        exchange: rabbitMQConfig.websocketFriendMessageExchange,
        routingKey: 'friend-publish-route',
        queue: rabbitMQConfig.websocketFriendMessageQueue,
    })
    public async taskSubscriberFriend(@Payload() message: any, @Ctx() context: RmqContext ) {
        console.log('rabbit接收到了点对点一个新的任务，开始干活了');
        const data: KafkaPayload = JSON.parse(message);
        console.log(data);
        await this.amqpMessageProductService.sendFriendMessage(data);
    }

    @RabbitRPC({
        exchange: rabbitMQConfig.websocketGroupMessageExchange,
        routingKey: 'group-publish-route',
        queue: rabbitMQConfig.websocketGroupMessageQueue,
    })
    public taskSubscriberGroup(@Payload() message: any, @Ctx() context: RmqContext ) {
        console.log('rabbit接收到了一个群信息新的任务，开始干活了');
        const data: KafkaPayload = JSON.parse(message);
        console.log(data);
    }
}
