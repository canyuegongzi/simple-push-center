import { Module} from '@nestjs/common';
import {KafkaTaskController} from "../controller/KafkaTaskController";
import {KafkaModule} from "../common/kafka/KafkaModule";
import {TaskKafkaProductService} from "../service/service/TaskKafkaProductService";
import {CommonConfigService} from "../config/CommonConfigService";
import {CommonConfigKey} from "../config/CommonConfigInterface";
const commonConfigService = new CommonConfigService();

@Module({
    imports: [
        KafkaModule.register({
            clientId: 'push-app-client',
            brokers: [commonConfigService.get(CommonConfigKey.KAfKA)],
            groupId: 'push-app-group',
        })
    ],
    controllers: [KafkaTaskController],
    providers: [TaskKafkaProductService],
    exports: [],
})
export class KafkaTaskModule {}

