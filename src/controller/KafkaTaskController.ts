import {Body, Controller, Get, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import moment = require("moment");
import {TaskKafkaProductService} from "../service/service/TaskKafkaProductService";
import {KafkaTaskDto} from "../model/DTO/kafka/KafkaTaskDto";
moment.locale('zh-cn')

@Controller('kafka')
export class KafkaTaskController {
    constructor(private readonly taskKafkaProductService: TaskKafkaProductService) {}

    @Get('/send/consumer')
    async sendToConsumer() {
        return await this.taskKafkaProductService.send();
    }

    @Post('newTask')
    public async kafkaEmitNewTask(@Body() kafkaTaskDto: KafkaTaskDto) {
        return await this.taskKafkaProductService.sendPushTask(kafkaTaskDto);
    }

}
