import {forwardRef, Module} from '@nestjs/common';
import {RedisModule} from 'nestjs-redis';
import {mongodbConfig, redisConfig} from './config/config.json';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppKeyEntity} from './model/mongoEntity/appKey.entity';
import {EmailConfigEntity} from './model/mongoEntity/emailConfig.entity';
import {MessageConfigEntity} from './model/mongoEntity/messageConfig.entity';
import {TaskEntity} from './model/mongoEntity/task.entity';
import {TaskLogEntity} from './model/mongoEntity/taskLog.entity';
import {AppKeyModule} from './module/appKey.module';
import {TaskModule} from './module/task.module';
import {SystemConfigEntity} from "./model/mongoEntity/systemConfig.entity";
import {EventModule} from "./module/event.module";
import {HelpModule} from "./module/help.module";
import {AmqpMessageModule} from "./module/amqpMessage.module";
import {AmqpMessageConsumerModule} from "./module/amqpMessageConsumer.module";
import {FriendMessageEntity} from "./model/mongoEntity/friendMessage.entity";
import {GroupMessageEntity} from "./model/mongoEntity/groupMessage.entity";
import {FriendMessageOffLineEntity} from "./model/mongoEntity/friendMessageOffLine.entity";

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
                entities: [AppKeyEntity, EmailConfigEntity, SystemConfigEntity, MessageConfigEntity, TaskEntity, TaskLogEntity, FriendMessageEntity, GroupMessageEntity, FriendMessageOffLineEntity],
            },
        ),
        EventModule,
        TaskModule,
        AppKeyModule,
        HelpModule,
        AmqpMessageModule,
        AmqpMessageConsumerModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
