import {forwardRef, Module} from '@nestjs/common';
import {TaskConfigService} from '../service/service/taskConfig.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MessageConfigEntity} from '../model/mongoEntity/messageConfig.entity';
import {EmailConfigEntity} from '../model/mongoEntity/emailConfig.entity';
import {TaskConfigController} from '../controller/taskConfig.controller';
import {RedisCacheService} from '../service/service/redisCache.service';
import {UtilService} from '../service/service/util.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmailConfigEntity, MessageConfigEntity], 'mongoCon'),
    ],
    controllers: [ TaskConfigController],
    providers: [TaskConfigService, RedisCacheService, UtilService],
    exports: [TaskConfigService],
})
export class TaskConfigModule {}
