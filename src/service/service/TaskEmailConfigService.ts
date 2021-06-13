import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {EmailConfigEntity} from '../../model/entity/EmailConfigEntity';
import {RedisCacheService} from './RedisCacheService';
import {Repository, UpdateResult} from "typeorm";
import {CreateEmailConfigDto} from "../../model/DTO/config/CreateEmailConfigDto";
import {EmailGetDto} from "../../model/DTO/config/EmailGetDto";
import {ApiException} from "../../common/error/exceptions/ApiException";
import {ApiErrorCode} from "../../config/ApiErrorCodeEnum";
import {InsertResult} from "typeorm/query-builder/result/InsertResult";

@Injectable()
export class TaskEmailConfigService {
    constructor(
        @Inject(RedisCacheService) private readonly redisCacheService: RedisCacheService,
        @InjectRepository(EmailConfigEntity) private readonly emailConfigEntityRepository: Repository<EmailConfigEntity>,
    ) {}

    /**
     * 创建邮箱推送配置
     * @param params<CreateEmailConfigDto>
     */
    public async addEmailConfig(params: CreateEmailConfigDto): Promise<InsertResult> {
        try {
            delete params.id;
            return await this.emailConfigEntityRepository
                .createQueryBuilder('u')
                .insert()
                .into(EmailConfigEntity)
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
    public async editEmailConfig(params: CreateEmailConfigDto): Promise<UpdateResult> {
        try {
            return this.emailConfigEntityRepository
                .createQueryBuilder('u')
                .update(EmailConfigEntity)
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
    public async delEmailConfig(params: Array<number | string>) {
        try {
            return this.emailConfigEntityRepository
                .createQueryBuilder('u')
                .update(EmailConfigEntity)
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
    public async getAllEmailConfig(query: EmailGetDto, user: any): Promise<{data: EmailConfigEntity[], count: number}> {
        try {
            const queryConditionList = ['u.isDelete = :isDelete'];
            if (query.status) queryConditionList.push('u.status = :status');
            if (query.isDefault) queryConditionList.push('u.isDefault = :isDefault');
            if (query.name) queryConditionList.push('u.name LIKE :name');
            if (query.operateUser) queryConditionList.push('u.operateUser = :operateUser');
            const queryCondition = queryConditionList.join(' AND ');
            const res = await this.emailConfigEntityRepository
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
            throw new ApiException('查询失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}
