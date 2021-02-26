import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { AppKeyEntity } from '../../model/mongoEntity/AppKeyEntity';
import { RedisCacheService } from './RedisCacheService';
import { CreateAppKeyDto } from '../../model/DTO/appKey/CreateAppKeyDto';
import { AppKeyGetDto } from '../../model/DTO/appKey/AppKeyGetDto';
import { UniqueAppKey } from '../../model/DTO/appKey/UniqueAppKey';
import { SystemConfigEntity } from "../../model/mongoEntity/SystemConfigEntity";
import { AppTaskConfig } from "../../model/DTO/task/AppTaskConfig";
export declare class AppKeyService {
    private readonly appKeyEntityRepository;
    private readonly systemConfigEntityRepository;
    private readonly redisCacheService;
    private readonly jwtService;
    constructor(appKeyEntityRepository: MongoRepository<AppKeyEntity>, systemConfigEntityRepository: MongoRepository<SystemConfigEntity>, redisCacheService: RedisCacheService, jwtService: JwtService);
    private sendMailer;
    protected makCode(): string;
    sendEmailCode(userName: string, email: string): Promise<{
        success: boolean;
        data: unknown;
        message: string;
        code: number;
    }>;
    verifyEmailCode(email: any, value: any): Promise<any>;
    getAppKeyByEmail(name: string, email: string, expiresTime: string): Promise<{
        expiration: number;
        accessToken: string;
        secret: string;
    }>;
    addAppKey(params: CreateAppKeyDto): Promise<import("typeorm").InsertOneWriteOpResult>;
    getAppKeyList(params: AppKeyGetDto, user: any): Promise<[AppKeyEntity[], number]>;
    delAppKey(params: string): Promise<import("typeorm").DeleteWriteOpResultObject>;
    uniqueAppKey(params: UniqueAppKey): Promise<boolean>;
    getInfo(name: string): Promise<AppKeyEntity>;
    editSystemConfig(params: AppTaskConfig): Promise<void>;
    getSystemConfig(name: string): Promise<SystemConfigEntity>;
}
