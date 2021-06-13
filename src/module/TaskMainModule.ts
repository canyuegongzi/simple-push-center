import { BullModule } from '@nestjs/bull';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TaskEntity} from '../model/entity/TaskEntity';
import {TaskLogEntity} from '../model/entity/TaskLogEntity';
import {EmailConfigEntity} from '../model/entity/EmailConfigEntity';
import {MessageConfigEntity} from '../model/entity/MessageConfigEntity';
import {SystemConfigEntity} from "../model/entity/SystemConfigEntity";
import {TaskMainController} from "../controller/TaskMainController";
import {TaskMainService} from "../service/service/TaskMainService";
import {TaskEmailConfigService} from "../service/service/TaskEmailConfigService";
import {TaskMessageConfigService} from "../service/service/TaskMessageConfigService";
import {TaskCommonConfigService} from "../service/service/TaskCommonConfigService";
import {AppKeyService} from "../service/service/AppKeyService";
import {RedisCacheService} from "../service/service/RedisCacheService";
import {UtilService} from "../service/service/UtilService";
import {AppKeyEntity} from "../model/entity/AppKeyEntity";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {NoticeEmailProcessor} from "../service/processor/NoticeEmailProcessor";
import {TaskEmitEmailService} from "../service/service/TaskEmitEmailService";
import {NoticeMessageProcessor} from "../service/processor/NoticeMessageProcessor";
import {TaskEmitMessageService} from "../service/service/TaskEmitMessageService";
import {TaskLogService} from "../service/service/TaskLogService";
import {KafkaTaskModule} from "./KafkaTaskModule";
import {TaskKafkaConsumerModule} from "./TaskKafkaConsumerModule";
import {CommonConfigKey} from "../config/CommonConfigInterface";
import {CommonConfigService} from "../config/CommonConfigService";
const commonConfigService = new CommonConfigService();

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TaskEntity,
            SystemConfigEntity,
            EmailConfigEntity,
            MessageConfigEntity,
            AppKeyEntity,
            TaskLogEntity
        ]),
        BullModule.registerQueue(
            {name: 'email', redis: {
                    name: commonConfigService.get(CommonConfigKey.REDIS_NAME),
                    host: commonConfigService.get(CommonConfigKey.REDIS_HOST),
                    port: commonConfigService.get(CommonConfigKey.REDIS_POST),
                    password: commonConfigService.get(CommonConfigKey.REDIS_PASSWORD),
                }},
            {name: 'message', redis: {
                    name: commonConfigService.get(CommonConfigKey.REDIS_NAME),
                    host: commonConfigService.get(CommonConfigKey.REDIS_HOST),
                    port: commonConfigService.get(CommonConfigKey.REDIS_POST),
                    password: commonConfigService.get(CommonConfigKey.REDIS_PASSWORD),
                }},
        ),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'marvin-app-key-notice-platform',
            signOptions: {
                expiresIn: 1000 * 60 * 24 * 30,
            },
        }),
        KafkaTaskModule,
        TaskKafkaConsumerModule
    ],
    controllers: [ TaskMainController ],
    providers: [
        TaskEmailConfigService,
        TaskMessageConfigService,
        TaskCommonConfigService,
        AppKeyService,
        RedisCacheService,
        UtilService,
        TaskMainService,
        TaskEmitEmailService,
        TaskEmitMessageService,
        NoticeEmailProcessor,
        NoticeMessageProcessor,
        TaskLogService
    ],
    exports: [],
})
export class TaskMainModule {}
