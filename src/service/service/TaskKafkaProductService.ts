import { Injectable} from '@nestjs/common';
import moment = require('moment');
import {KafkaService} from "../../common/kafka/KafkaService";
import {KafkaPayload} from "../../common/kafka/KafkaMessage";
import { TASK_PUSH_INFO} from "../../config/constant";
import {KafkaTaskDto} from "../../model/DTO/kafka/KafkaTaskDto";
moment.locale('zh-cn')

@Injectable()
export class TaskKafkaProductService{
    constructor(private readonly kafkaService: KafkaService) {}

    /**
     * kafka推送一个消息到push-center
     * @param kafkaTaskDto <KafkaTaskDto>
     */
    public async sendPushTask(kafkaTaskDto: KafkaTaskDto): Promise<any> {
        const message: KafkaTaskDto = kafkaTaskDto;
        const payload: KafkaPayload = {
            messageId: '' + new Date().valueOf(),
            body: message,
            messageType: TASK_PUSH_INFO,
            topicName: TASK_PUSH_INFO,
        };
        return await this.kafkaService.sendMessage(TASK_PUSH_INFO, payload);
    }
}
