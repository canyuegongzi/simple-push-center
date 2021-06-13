import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailConfigEntity} from "../model/entity/EmailConfigEntity";
import {MessageConfigEntity} from "../model/entity/MessageConfigEntity";
import {RedisCacheService} from "../service/service/RedisCacheService";
import {UtilService} from "../service/service/UtilService";
import {TaskEmailConfigService} from "../service/service/TaskEmailConfigService";
import {TaskCommonConfigController} from "../controller/TaskCommonConfigController";
import {TaskCommonConfigService} from "../service/service/TaskCommonConfigService";
import {TaskEmailConfigController} from "../controller/TaskEmailConfigController";
import {TaskMessageConfigController} from "../controller/TaskMessageConfigController";
import {TaskMessageConfigService} from "../service/service/TaskMessageConfigService";
import {AppKeyService} from "../service/service/AppKeyService";
import {AppKeyController} from "../controller/AppKeyController";
import {AppKeyEntity} from "../model/entity/AppKeyEntity";
import {SystemConfigEntity} from "../model/entity/SystemConfigEntity";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([EmailConfigEntity, MessageConfigEntity, AppKeyEntity, SystemConfigEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'marvin-app-key-notice-platform',
            signOptions: {
                expiresIn: 1000 * 60 * 24 * 30,
            },
        }),
    ],
    controllers: [ TaskEmailConfigController, TaskMessageConfigController, TaskCommonConfigController, AppKeyController],
    providers: [TaskEmailConfigService, TaskMessageConfigService, TaskCommonConfigService, AppKeyService, RedisCacheService, UtilService],
    exports: [TaskEmailConfigService, TaskMessageConfigService, TaskCommonConfigService, AppKeyService],
})
export class TaskCommonConfigModule {}
