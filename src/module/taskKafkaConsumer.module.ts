import { Module } from '@nestjs/common';
import {TaskKafkaConsumerService} from "../service/service/taskKafkaConsumer.service";

@Module({
  providers: [TaskKafkaConsumerService],
})
export class TaskKafkaConsumerModule {}
