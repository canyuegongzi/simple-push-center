import { EmailConfigEntity } from '../../model/mongoEntity/EmailConfigEntity';
import { MongoRepository } from 'typeorm';
import { RedisCacheService } from './RedisCacheService';
import { MessageGetDto } from '../../model/DTO/config/MessageGetDto';
import { CreateMessageConfigDto } from '../../model/DTO/config/CreateMessageConfigDto';
import { CreateEmailConfigDto } from '../../model/DTO/config/CreateEmailConfigDto';
import { EmailGetDto } from '../../model/DTO/config/EmailGetDto';
import { MessageConfigEntity } from '../../model/mongoEntity/MessageConfigEntity';
import { UniqueKey } from '../../model/DTO/config/UniqueKey';
import { GetDefaultDto } from "../../model/DTO/config/GetDefaultDto";
export declare class TaskConfigService {
    private readonly redisCacheService;
    private readonly emailConfigEntityRepository;
    private readonly messageConfigEntityRepository;
    constructor(redisCacheService: RedisCacheService, emailConfigEntityRepository: MongoRepository<EmailConfigEntity>, messageConfigEntityRepository: MongoRepository<MessageConfigEntity>);
    getAllMessageConfig(params: MessageGetDto, user: any): Promise<{
        data: MessageConfigEntity[];
        count: number;
    }>;
    delMessageConfig(params: Array<number | string>): Promise<import("typeorm").DeleteWriteOpResultObject>;
    editMessageConfig(params: CreateMessageConfigDto): Promise<import("typeorm").UpdateWriteOpResult>;
    addMessageConfig(params: CreateMessageConfigDto): Promise<import("typeorm").InsertOneWriteOpResult>;
    getAllEmailConfig(params: EmailGetDto, user: any): Promise<{
        data: EmailConfigEntity[];
        count: number;
    }>;
    delEmailConfig(params: Array<number | string>): Promise<import("typeorm").DeleteWriteOpResultObject>;
    editEmailConfig(params: CreateEmailConfigDto): Promise<import("typeorm").UpdateWriteOpResult>;
    addEmailConfig(params: CreateEmailConfigDto): Promise<import("typeorm").InsertOneWriteOpResult>;
    getEmailConfigInfo(taskConfig: string): Promise<EmailConfigEntity>;
    getMessageConfigInfo(taskConfig: string): Promise<MessageConfigEntity>;
    uniqueName(params: UniqueKey): Promise<boolean>;
    getDefaultList(params: GetDefaultDto, user: any): Promise<EmailConfigEntity[] | MessageConfigEntity[]>;
}
