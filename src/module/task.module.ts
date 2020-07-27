import { BullModule } from '@nestjs/bull';
import {forwardRef, Module} from '@nestjs/common';
import {NoticeEmailProcessor} from '../service/processor/email.processor';
import {TaskService} from '../service/service/task.service';
import {TaskConfigService} from '../service/service/taskConfig.service';
import {TaskEmitEmailService} from '../service/service/taskEmitEmail.service';
import {TaskLogService} from '../service/service/taskLog.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TaskEntity} from '../model/mongoEntity/task.entity';
import {TaskLogEntity} from '../model/mongoEntity/taskLog.entity';
import {TaskController} from '../controller/task.controller';
import {TaskEmitMessageService} from '../service/service/taskEmitMessage.service';
import {MessageEmailProcessor} from '../service/processor/message.processor';
import {RedisCacheService} from '../service/service/redisCache.service';
import {UtilService} from '../service/service/util.service';
import {EmailConfigEntity} from '../model/mongoEntity/emailConfig.entity';
import {MessageConfigEntity} from '../model/mongoEntity/messageConfig.entity';
import {SystemConfigEntity} from "../model/mongoEntity/systemConfig.entity";
import {KafkaTaskModule} from "./kafkaTask.module";
import {TaskKafkaConsumerModule} from "./taskKafkaConsumer.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity, TaskLogEntity, SystemConfigEntity, EmailConfigEntity, MessageConfigEntity], 'mongoCon'),
        BullModule.registerQueue(
            {name: 'email'},
            {name: 'message'},
        ),
        KafkaTaskModule,
        TaskKafkaConsumerModule
    ],
    controllers: [ TaskController],
    providers: [TaskService, TaskEmitEmailService, TaskConfigService, TaskLogService, TaskEmitMessageService, RedisCacheService, UtilService, NoticeEmailProcessor, MessageEmailProcessor],
    exports: [],
})
export class TaskModule {}
