import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppKeyService} from '../service/service/AppKeyService';
import {AppKeyController} from '../controller/AppKeyController';
import {AppKeyEntity} from '../model/mongoEntity/AppKeyEntity';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {RedisCacheService} from '../service/service/RedisCacheService';
import {UtilService} from '../service/service/UtilService';
import {SystemConfigEntity} from "../model/mongoEntity/SystemConfigEntity";

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
