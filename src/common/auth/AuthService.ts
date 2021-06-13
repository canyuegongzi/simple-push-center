import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/JwtPayloadInterface';
import {JwtPayloadToken} from './interfaces/JwtPayloadJwtPayloadInterfface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user: JwtPayload): Promise<string> {
    return this.jwtService.sign(user);
  }
  /**
   * 产生token
   * @param user
   */
  async creatToken(user: JwtPayloadToken): Promise<any> {
    const expiration = 60 * 60;
    const accessToken = await this.jwtService.sign(user, {
      expiresIn: expiration,
    });
    return {
      expiration,
      accessToken,
      success: true,
    };
  }
}
