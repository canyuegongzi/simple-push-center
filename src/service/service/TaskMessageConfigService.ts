import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {RedisCacheService} from './RedisCacheService';
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {ApiException} from "../../common/error/exceptions/ApiException";
import {ApiErrorCode} from "../../config/ApiErrorCodeEnum";
import {InsertResult} from "typeorm/query-builder/result/InsertResult";
import {MessageConfigEntity} from "../../model/entity/MessageConfigEntity";
import {MessageGetDto} from "../../model/DTO/config/MessageGetDto";
import {CreateMessageConfigDto} from "../../model/DTO/config/CreateMessageConfigDto";

@Injectable()
export class TaskMessageConfigService {
    constructor(
        @Inject(RedisCacheService) private readonly redisCacheService: RedisCacheService,
        @InjectRepository(MessageConfigEntity) private readonly configEntityRepository: Repository<MessageConfigEntity>,
    ) {}

    /**
     * 创建邮箱推送配置
     * @param params<CreateEmailConfigDto>
     */
    public async addConfig(params: CreateMessageConfigDto): Promise<InsertResult> {
        try {
            delete params.id;
            return await this.configEntityRepository
                .createQueryBuilder('u')
                .insert()
                .into(MessageConfigEntity)
                .values([ {
                    isDelete: 0,
                    ...params
                }])
                .execute();
        } catch (e) {
            console.log(e);
            throw new ApiException('添加失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 编辑配置信息
     * @param params<CreateEmailConfigDto>
     */
    public async editConfig(params: CreateMessageConfigDto): Promise<UpdateResult> {
        try {
            return this.configEntityRepository
                .createQueryBuilder('u')
                .update(MessageConfigEntity)
                .set({...params})
                .execute();
        } catch (e) {
            throw new ApiException('编辑失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 删除配置信息
     * @param params<Array<number>>
     */
    public async delConfig(params: Array<number | string>): Promise<DeleteResult> {
        try {
            return this.configEntityRepository
                .createQueryBuilder('u')
                .update(MessageConfigEntity)
                .set({isDelete: 1, deleteTime: new Date().getTime()})
                .whereInIds(params)
                .execute();
        } catch (e) {
            throw new ApiException('编辑失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 查询邮箱推送配置列表
     * @param query
     * @param user
     */
    public async getAllConfig(query: MessageGetDto, user: any): Promise<{data: MessageConfigEntity[], count: number}> {
        try {
            const queryConditionList = ['u.isDelete = :isDelete'];
            if (query.status) queryConditionList.push('u.status = :status');
            if (query.isDefault) queryConditionList.push('u.isDefault = :isDefault');
            if (query.name) queryConditionList.push('u.name LIKE :name');
            if (query.operateUser) queryConditionList.push('u.operateUser = :operateUser');
            const queryCondition = queryConditionList.join(' AND ');
            const res = await this.configEntityRepository
                .createQueryBuilder('u')
                .where(queryCondition, {
                    name: `%${query.name}%`,
                    operateUser: user,
                    isDefault: query.isDefault,
                    isDelete: query.isDelete ? query.isDelete : 0,
                    status: query.status
                })
                .orderBy('u.name', 'ASC')
                .getManyAndCount();
            return  { data: res[0], count: res[1]};
        } catch (e) {
            console.log(e);
            throw new ApiException('查询失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}
