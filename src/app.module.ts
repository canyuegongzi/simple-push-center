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
                synchronize: true,
                entities: [AppKeyEntity, EmailConfigEntity, SystemConfigEntity, MessageConfigEntity, TaskEntity, TaskLogEntity],
            },
        ),
        TaskModule,
        AppKeyModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
