import {Inject, Injectable} from '@nestjs/common';
import moment = require('moment');
import {KafkaPayload} from "../../common/kafka/kafka.message";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {rabbitMQConfig} from "../../config/config.json";
import {AmqpMessageProductService} from "./amqpMessageProduct.service";
import {InjectRepository} from "@nestjs/typeorm";
import {AppKeyEntity} from "../../model/mongoEntity/appKey.entity";
import {MongoRepository} from "typeorm";
import {FriendMessageEntity} from "../../model/mongoEntity/friendMessage.entity";
import {GroupMessageEntity} from "../../model/mongoEntity/groupMessage.entity";
moment.locale('zh-cn')

@Injectable()
export class AmqpMessageConsumerService {

    constructor(
        @Inject(AmqpMessageProductService) private readonly amqpMessageProductService: AmqpMessageProductService,
        @InjectRepository(FriendMessageEntity) private readonly friendMessageEntityRepository: MongoRepository<FriendMessageEntity>,
        @InjectRepository(GroupMessageEntity) private readonly groupMessageEntity: MongoRepository<GroupMessageEntity>
    ) {}

    /*@RabbitRPC({
        exchange: rabbitMQConfig.websocketFriendMessageExchange,
        routingKey: 'friend-publish-route',
        queue: rabbitMQConfig.websocketFriendMessageQueue,
    })
    public async taskSubscriberFriend(@Payload() message: any, @Ctx() context: RmqContext ) {
        console.log('rabbit接收到了点对点一个新的任务，开始干活了');
        const data: KafkaPayload = JSON.parse(message);
        console.log(data);
        try {
            const res = await this.amqpMessageProductService.sendFriendMessage(data);
            console.log('消息已经处理')
            console.log(res)
        }catch (e) {
            console.log(e)
        }

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
    }*/
}
