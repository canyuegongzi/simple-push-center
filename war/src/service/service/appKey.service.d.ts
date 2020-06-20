import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { AppKeyEntity } from '../../model/mongoEntity/appKey.entity';
import { RedisCacheService } from './redisCache.service';
import { CreateAppKeyDto } from '../../model/DTO/appKey/CreateAppKeyDto';
import { AppKeyGetDto } from '../../model/DTO/appKey/AppKeyGetDto';
import { UniqueAppKey } from '../../model/DTO/appKey/UniqueAppKey';
export declare class AppKeyService {
    private readonly appKeyEntityRepository;
    private readonly redisCacheService;
    private readonly jwtService;
    constructor(appKeyEntityRepository: MongoRepository<AppKeyEntity>, redisCacheService: RedisCacheService, jwtService: JwtService);
    private sendMailer;
    protected makCode(): string;
    sendEmailCode(userName: string, email: string): Promise<{
        success: boolean;
        data: unknown;
        message: string;
        code: number;
    }>;
    verifyEmailCode(email: any, value: any): Promise<boolean>;
    getAppKeyByEmail(name: string, email: string, expiresTime: string): Promise<{
        expiration: number;
        accessToken: string;
    }>;
    addAppKey(params: CreateAppKeyDto): Promise<import("typeorm").InsertOneWriteOpResult>;
    getAppKeyList(params: AppKeyGetDto, user: any): Promise<[AppKeyEntity[], number]>;
    delAppKey(params: string): Promise<import("typeorm").DeleteWriteOpResultObject>;
    uniqueAppKey(params: UniqueAppKey): Promise<boolean>;
}
