import {forwardRef, Module} from '@nestjs/common';
import {RedisModule} from 'nestjs-redis';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppKeyEntity} from './model/entity/AppKeyEntity';
import {EmailConfigEntity} from './model/entity/EmailConfigEntity';
import {MessageConfigEntity} from './model/entity/MessageConfigEntity';
import {TaskEntity} from './model/entity/TaskEntity';
import {TaskLogEntity} from './model/entity/TaskLogEntity';
import {SystemConfigEntity} from "./model/entity/SystemConfigEntity";
import {CommonConfigKey} from "./config/CommonConfigInterface";
import {CommonConfigService} from "./config/CommonConfigService";
import {TaskCommonConfigModule} from "./module/TaskCommonConfigModule";
import {TaskMainModule} from "./module/TaskMainModule";
import {EventModule} from "./module/EventModule";
import {HelpModule} from "./module/HelpModule";
const commonConfigService = new CommonConfigService();

@Module({
    imports: [
        RedisModule.register({
            name: commonConfigService.get(CommonConfigKey.REDIS_NAME),
            host: commonConfigService.get(CommonConfigKey.REDIS_HOST),
            port: commonConfigService.get(CommonConfigKey.REDIS_POST),
            password: commonConfigService.get(CommonConfigKey.REDIS_PASSWORD),
        }),
        TypeOrmModule.forRoot(
            {
                type: 'mysql',
                host: commonConfigService.get(CommonConfigKey.MYSQL),
                port: commonConfigService.get(CommonConfigKey.MYSQL_PORT),
                username: commonConfigService.get(CommonConfigKey.MYSQL_USER),
                password: commonConfigService.get(CommonConfigKey.MYSQL_PASSWORD),
                database: commonConfigService.get(CommonConfigKey.MYSQL_DATABASE_NAME) ,
                entities: [AppKeyEntity, EmailConfigEntity, SystemConfigEntity, MessageConfigEntity, TaskEntity, TaskLogEntity],
                synchronize: true,
            },
        ),
        EventModule,
        HelpModule,
        TaskCommonConfigModule,
        TaskMainModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
