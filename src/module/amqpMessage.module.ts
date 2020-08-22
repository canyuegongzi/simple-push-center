import { Module} from '@nestjs/common';
import {AmqpMessageController} from "../controller/amqpMessage.controller";
import {AmqpMessageProductService} from "../service/service/amqpMessageProduct.service";
import {rabbitMQConfig} from "../config/config.json"
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {AmqpMessageConsumerService} from "../service/service/amqpMessageConsumer.service";

@Module({
    imports: [
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
            ],
            uri: rabbitMQConfig.url,
        })
    ],
    controllers: [AmqpMessageController],
    providers: [AmqpMessageProductService, AmqpMessageConsumerService],
    exports: [],
})
export class AmqpMessageModule {}

