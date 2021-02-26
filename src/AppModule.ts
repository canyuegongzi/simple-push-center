import {forwardRef, Module} from '@nestjs/common';
import {RedisModule} from 'nestjs-redis';
import {mongodbConfig, redisConfig} from './config/config.json';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppKeyEntity} from './model/mongoEntity/AppKeyEntity';
import {EmailConfigEntity} from './model/mongoEntity/EmailConfigEntity';
import {MessageConfigEntity} from './model/mongoEntity/MessageConfigEntity';
import {TaskEntity} from './model/mongoEntity/TaskEntity';
import {TaskLogEntity} from './model/mongoEntity/TaskLogEntity';
import {AppKeyModule} from './module/AppKeyModule';
import {TaskModule} from './module/TaskModule';
import {SystemConfigEntity} from "./model/mongoEntity/SystemConfigEntity";
import {EventModule} from "./module/EventModule";
import {HelpModule} from "./module/HelpModule";

@Module({
    imports: [
        RedisModule.register(redisConfig),
        TypeOrmModule.forRoot(
            {
                name: 'mongoCon',
                type: 'mongodb',
                host: mongodbConfig.host,
                port: 27017,
                useNewUrlParser: true,
                database: 'notice',
                authSource: 'admin',
                synchronize: true,
                username: mongodbConfig.userName,
                password: mongodbConfig.password,
                entities: [AppKeyEntity, EmailConfigEntity, SystemConfigEntity, MessageConfigEntity, TaskEntity, TaskLogEntity],
            },
        ),
        EventModule,
        TaskModule,
        AppKeyModule,
        HelpModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
