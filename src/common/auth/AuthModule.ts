import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './AuthService';
import { AuthStrategy } from './JwtStrategy';
import { serverConfig as config} from '../../config/CommonConfigService';
@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'marvin',
      signOptions: {
        expiresIn: config.tokenSetTimeOut,
      },
    })
  ],
  providers: [AuthService, AuthStrategy],
  // exports: [PassportModule, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
