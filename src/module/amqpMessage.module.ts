import { Module} from '@nestjs/common';
import {AmqpMessageController} from "../controller/amqpMessage.controller";
import {AmqpMessageProductService} from "../service/service/amqpMessageProduct.service";
import {rabbitMQConfig} from "../config/config.json"
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {AmqpMessageConsumerService} from "../service/service/amqpMessageConsumer.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppKeyEntity} from "../model/mongoEntity/appKey.entity";
import {SystemConfigEntity} from "../model/mongoEntity/systemConfig.entity";
import {FriendMessageEntity} from "../model/mongoEntity/friendMessage.entity";
import {GroupMessageEntity} from "../model/mongoEntity/groupMessage.entity";
import {WebsocketMessageService} from "../service/service/websocketMessage.service";
import {UtilService} from "../service/service/util.service";
import {FriendMessageOffLineEntity} from "../model/mongoEntity/friendMessageOffLine.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([FriendMessageEntity, GroupMessageEntity, FriendMessageOffLineEntity], 'mongoCon'),
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: rabbitMQConfig.websocketFriendMessageExchange,
                    type: 'topic',
                },
                {
                    name: rabbitMQConfig.websocketGroupMessageExchange,
                    type: 'topic',
                },
                {
                    name: rabbitMQConfig.websocketRequestExchange,
                    type: 'topic',
                },
            ],
            uri: rabbitMQConfig.url,
        })
    ],
    controllers: [AmqpMessageController],
    providers: [AmqpMessageProductService, AmqpMessageConsumerService, WebsocketMessageService, UtilService],
    exports: [],
})
export class AmqpMessageModule {}

