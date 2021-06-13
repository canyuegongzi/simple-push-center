import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EmailConfigEntity} from '../../model/entity/EmailConfigEntity';
import {RedisCacheService} from './RedisCacheService';
import {Repository} from "typeorm";
import {GetDefaultDto, TaskConfigType} from "../../model/DTO/config/GetDefaultDto";
import {UniqueKey} from "../../model/DTO/config/UniqueKey";
import {ApiException} from "../../common/error/exceptions/ApiException";
import {ApiErrorCode} from "../../config/ApiErrorCodeEnum";
import {MessageConfigEntity} from "../../model/entity/MessageConfigEntity";


@Injectable()
export class TaskCommonConfigService {
    constructor(
        @Inject(RedisCacheService) private readonly redisCacheService: RedisCacheService,
        @InjectRepository(EmailConfigEntity) private readonly emailConfigEntityRepository: Repository<EmailConfigEntity>,
        @InjectRepository(MessageConfigEntity) private readonly messageConfigEntityRepository: Repository<MessageConfigEntity>,
    ) {}

    /**
     * 查询默认配置选项
     * @param params
     * @param user
     */
    public async getDefaultList(params: GetDefaultDto, user?: any): Promise<EmailConfigEntity[] | MessageConfigEntity[]> {
        const configType: TaskConfigType = params.type;
        const configTypeConfig: Record<string, number> = {email: 1, message: 2, 1: 1, 2: 2}
        switch (configTypeConfig[configType]) {
            case 1:
                return await this.emailConfigEntityRepository.find({where:{ status: 1, isDefault: 1 }, select: ['name', 'status', 'id', 'operateUser']})
            case 2:
                return await this.messageConfigEntityRepository.find({where:{ status: 1, isDefault: 1 }, select: ['name', 'status', 'id', 'operateUser']})
            default:
                return []
        }
    }

    /**
     * 配置名称唯一性校验
     * @param query<UniqueKey>
     */
    public async uniqueName(query: UniqueKey): Promise<boolean> {
        try {
            const queryConditionList = ['u.isDelete = :isDelete'];
            if (query.name) queryConditionList.push('u.name = :name');
            const queryCondition = queryConditionList.join(' AND ');
            let result: any = null;
            switch (query.type) {
                case 'email':
                    result = await this.emailConfigEntityRepository
                        .createQueryBuilder('u')
                        .where(queryCondition, {name: query.name, isDelete: 0})
                        .getOne();
                    break;
                case 'message':
                    result = await this.messageConfigEntityRepository
                        .createQueryBuilder('u')
                        .where(queryCondition, {name: query.name, isDelete: 0})
                        .getOne()
                    break;
            }
            return !!!result;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}
