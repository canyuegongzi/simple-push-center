import {forwardRef, Module} from '@nestjs/common';
import {TaskConfigService} from '../service/service/TaskConfigService';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MessageConfigEntity} from '../model/mongoEntity/MessageConfigEntity';
import {EmailConfigEntity} from '../model/mongoEntity/EmailConfigEntity';
import {TaskConfigController} from '../controller/TaskConfigController';
import {RedisCacheService} from '../service/service/RedisCacheService';
import {UtilService} from '../service/service/UtilService';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmailConfigEntity, MessageConfigEntity], 'mongoCon'),
    ],
    controllers: [ TaskConfigController],
    providers: [TaskConfigService, RedisCacheService, UtilService],
    exports: [TaskConfigService],
})
export class TaskConfigModule {}
