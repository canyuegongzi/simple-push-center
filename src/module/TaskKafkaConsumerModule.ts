import { Module } from '@nestjs/common';
import {TaskKafkaConsumerService} from "../service/service/TaskKafkaConsumerService";

@Module({
  providers: [TaskKafkaConsumerService],
})
export class TaskKafkaConsumerModule {}
