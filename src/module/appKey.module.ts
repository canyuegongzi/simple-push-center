import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppKeyService} from '../service/service/appKey.service';
import {AppKeyController} from '../controller/appKey.controller';
import {AppKeyEntity} from '../model/mongoEntity/appKey.entity';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {RedisCacheService} from '../service/service/redisCache.service';
import {UtilService} from '../service/service/util.service';
import {SystemConfigEntity} from "../model/mongoEntity/systemConfig.entity";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'marvin-app-key-notice-platform',
            signOptions: {
                expiresIn: 1000 * 60 * 24 * 30,
            },
        }),
        TypeOrmModule.forFeature([AppKeyEntity, SystemConfigEntity], 'mongoCon'),
    ],
    controllers: [AppKeyController],
    providers: [ AppKeyService, RedisCacheService, UtilService],
    exports: [AppKeyService, UtilService],
})
export class AppKeyModule {}
