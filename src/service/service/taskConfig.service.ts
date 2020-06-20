import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EmailConfigEntity} from '../../model/mongoEntity/emailConfig.entity';
import {MongoRepository, ObjectID} from 'typeorm';
import {RedisCacheService} from './redisCache.service';
import {MessageGetDto} from '../../model/DTO/config/MessageGetDto';
import {CreateMessageConfigDto} from '../../model/DTO/config/CreateMessageConfigDto';
import {CreateEmailConfigDto} from '../../model/DTO/config/CreateEmailConfigDto';
import {EmailGetDto} from '../../model/DTO/config/EmailGetDto';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {MessageConfigEntity} from '../../model/mongoEntity/messageConfig.entity';
import {UniqueKey} from '../../model/DTO/config/UniqueKey';
import {GetDefaultDto} from "../../model/DTO/config/GetDefaultDto";

@Injectable()
export class TaskConfigService {
    constructor(
        @Inject(RedisCacheService) private readonly redisCacheService: RedisCacheService,
        @InjectRepository(EmailConfigEntity) private readonly emailConfigEntityRepository: MongoRepository<EmailConfigEntity>,
        @InjectRepository(MessageConfigEntity) private readonly messageConfigEntityRepository: MongoRepository<MessageConfigEntity>,
    ) {}

    /**
     * 查询配置
     * @param params
     */
    public async getAllMessageConfig(params: MessageGetDto, user: any) {
        const queryObg: any = {};
        if (params.status) {queryObg.status = params.status; }
        if (params.name) {queryObg.name = params.name; }
        if (user && user.name) {queryObg.operateUser = user.name; }
        try {
            const res = await this.messageConfigEntityRepository.findAndCount(queryObg);
            return {data: res[0], count: res[1] };
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 删除配置
     * @param params
     */
    public async delMessageConfig(params: Array<number | string>) {
        try {
            return await this.messageConfigEntityRepository.deleteMany( params);
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 编辑短信配置
     * @param params
     */
    public async editMessageConfig(params: CreateMessageConfigDto) {
        try {
            const messageConfigOptions: CreateMessageConfigDto = params as CreateMessageConfigDto;
            const newOptions = {...messageConfigOptions};
            delete newOptions.id;
            return await this.messageConfigEntityRepository.updateOne( {name: params.name }, { $set: newOptions });
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 添加短信配置
     * @param params
     */
    public async addMessageConfig(params: CreateMessageConfigDto) {
        try {
            const messageConfigOptions: CreateMessageConfigDto = params as CreateMessageConfigDto;
            return await this.messageConfigEntityRepository.insertOne(messageConfigOptions);
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 查询全部的邮件配置
     * @param params
     */
    public async getAllEmailConfig(params: EmailGetDto, user: any) {
        const queryObg: any = {};
        if (params.status) {queryObg.status = params.status; }
        if (params.name) {queryObg.name = params.name; }
        if (user && user.name) {queryObg.operateUser = user.name; }
        try {
            const res = await this.emailConfigEntityRepository.findAndCount(queryObg);
            return {data: res[0], count: res[1] };
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 删除配置文件
     * @param params
     */
    public async delEmailConfig(params: Array<number | string>) {
        try {
            return await this.emailConfigEntityRepository.deleteMany( params);
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 更新邮件配置
     * @param params
     */
    public async editEmailConfig(params: CreateEmailConfigDto) {
        try {
            const emailConfigOptions: EmailConfigEntity = params as EmailConfigEntity;
            const newOptions = {...emailConfigOptions};
            delete newOptions.id;
            await this.emailConfigEntityRepository.findOne(params.id);
            return await this.emailConfigEntityRepository.updateOne( {name: params.name }, { $set: newOptions });
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 添加邮件配置
     * @param params
     */
    public async addEmailConfig(params: CreateEmailConfigDto) {
        try {
            const emailConfigOptions: EmailConfigEntity = params as EmailConfigEntity;
            delete emailConfigOptions.id;
            return await this.emailConfigEntityRepository.insertOne( emailConfigOptions);
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 获取邮件配置
     * @param params
     */
    public async getEmailConfigInfo(taskConfig: string) {
        try {
            if (taskConfig) {
                return await this.emailConfigEntityRepository.findOne({name: taskConfig});
            } else {
                return await this.emailConfigEntityRepository.findOne({isDefault: 1});
            }
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 获取短信配置
     * @param params
     */
    public async getMessageConfigInfo(taskConfig: string) {
        try {
            if (taskConfig) {
                return await this.messageConfigEntityRepository.findOne({name: taskConfig});
            } else {
                return await this.messageConfigEntityRepository.findOne({isDefault: 1});
            }
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 唯一性
     * @param params
     */
    public async uniqueName(params: UniqueKey) {
        try {
            const queryObj: any = {};
            if (params.name) {queryObj.name = params.name; }
            if (params.email) {queryObj.email = params.email; }
            let result = null;
            if (params.type === 'email') {
                result = await this.emailConfigEntityRepository.findOne(queryObj);
            } else if (params.type === 'message') {
                result = await this.messageConfigEntityRepository.findOne(queryObj);
            }
            return !!!result;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
    
    /**
     * 加载默认配置
     * @param params
     * @param user
     */
    public async getDefaultList(params: GetDefaultDto, user: any) {
        const configType: any = Number(params.type);
        console.log(configType);
        switch (configType) {
            case 1:
                console.log(44555);
                return await this.emailConfigEntityRepository.find({where:{ status: '1', isDefault: '1' }, select: ['name', 'status', 'id', 'operateUser']})
                break;
            case 2:
                return await this.messageConfigEntityRepository.find({where:{ status: '1', isDefault: '1' }, select: ['name', 'status', 'id', 'operateUser']})
                break;
            default:
                return []
        }
    }
}
