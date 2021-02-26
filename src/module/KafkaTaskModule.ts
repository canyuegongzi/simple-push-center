import { Module} from '@nestjs/common';
import {KafkaTaskController} from "../controller/KafkaTaskController";
import {KafkaModule} from "../common/kafka/KafkaModule";
import {TaskKafkaProductService} from "../service/service/TaskKafkaProductService";
import {kafkaConfig} from "../config/config.json"

@Module({
    imports: [
        KafkaModule.register({
            clientId: kafkaConfig.clientId,
            brokers: [kafkaConfig.url],
            groupId: kafkaConfig.groupId,
        })
    ],
    controllers: [KafkaTaskController],
    providers: [TaskKafkaProductService],
    exports: [],
})
export class KafkaTaskModule {}

