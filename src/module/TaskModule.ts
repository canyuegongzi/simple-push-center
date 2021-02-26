import { BullModule } from '@nestjs/bull';
import {forwardRef, Module} from '@nestjs/common';
import {TaskService} from '../service/service/TaskService';
import {TaskConfigService} from '../service/service/TaskConfigService';
import {TaskEmitEmailService} from '../service/service/TaskEmitEmailService';
import {TaskLogService} from '../service/service/TaskLogService';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TaskEntity} from '../model/mongoEntity/TaskEntity';
import {TaskLogEntity} from '../model/mongoEntity/TaskLogEntity';
import {TaskController} from '../controller/TaskController';
import {TaskEmitMessageService} from '../service/service/TaskEmitMessageService';
import {MessageEmailProcessor} from '../service/processor/MessageProcessor';
import {RedisCacheService} from '../service/service/RedisCacheService';
import {UtilService} from '../service/service/UtilService';
import {EmailConfigEntity} from '../model/mongoEntity/EmailConfigEntity';
import {MessageConfigEntity} from '../model/mongoEntity/MessageConfigEntity';
import {SystemConfigEntity} from "../model/mongoEntity/SystemConfigEntity";
import {KafkaTaskModule} from "./KafkaTaskModule";
import {TaskKafkaConsumerModule} from "./TaskKafkaConsumerModule";
import {NoticeEmailProcessor} from "../service/processor/NoticeEmailProcessor";

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
