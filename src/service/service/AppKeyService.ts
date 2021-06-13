import { JwtService } from '@nestjs/jwt';
import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import {ApiException} from '../../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../../config/ApiErrorCodeEnum';
import {AppKeyEntity} from '../../model/entity/AppKeyEntity';
import {RedisCacheService} from './RedisCacheService';
import * as nodemailer from 'nodemailer';
import {emailConfig} from '../../config/CommonConfigService';
import moment = require('moment');

moment.locale('zh-cn')
import {JwtAppKeyToken} from '../../model/types/JwtAppKeyToken';
import {CreateAppKeyDto} from '../../model/DTO/appKey/CreateAppKeyDto';
import {AppKeyGetDto} from '../../model/DTO/appKey/AppKeyGetDto';
import {UniqueAppKey} from '../../model/DTO/appKey/UniqueAppKey';
import fnv = require('fnv-plus');
import {SystemConfigEntity} from "../../model/entity/SystemConfigEntity";
import {AppTaskConfig} from "../../model/DTO/task/AppTaskConfig";
import {DeleteWriteOpResultObject, InsertOneWriteOpResult} from "typeorm/driver/mongodb/typings";
import {MessageConfigEntity} from "../../model/entity/MessageConfigEntity";
import {InsertResult} from "typeorm/query-builder/result/InsertResult";
@Injectable()
export class AppKeyService {
    constructor(
        @InjectRepository(AppKeyEntity) private readonly appKeyEntityRepository: Repository<AppKeyEntity>,
        @InjectRepository(SystemConfigEntity) private readonly systemConfigEntityRepository: Repository<SystemConfigEntity>,
        @Inject(RedisCacheService) private readonly redisCacheService: RedisCacheService,
        @Inject(JwtService) private readonly jwtService: JwtService,
    ) {}

    /**
     * 发送邮件
     */
    private sendMailer(mailOptions: any) {
        let transporter: any = null;
        return new Promise((resolve, reject) => {
            try {
                transporter = nodemailer.createTransport({
                    // host: 'smtp.ethereal.email',
                    service: 'QQ', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
                    port: 465, // SMTP 端口
                    secureConnection: false, // 使用了 SSL
                    auth: {
                        user: emailConfig.user,
                        pass: emailConfig.authPass,
                    },
                });
            } catch (e) {
                reject(e);
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
        });
    }

    /**
     * 产生一个code
     */
    protected makCode(): string {
        let code = '';
        for (let i = 1; i <= 6; i++) {
            const num = Math.floor(Math.random() * 10);
            code += num;
        }
        return code;
    }

    /**
     * 发送邮件
     */
    public async sendEmailCode(userName: string, email: string): Promise<any> {
        const code: any = this.makCode();
        const mailOptions = {
            from: '"系统用户安全认证中心（推送系統註冊）" <1970305447@qq.com>', // sender address
            to: email, // list of receivers
            subject: '注册验证码', // Subject line
            html: `验证码${code}，用于注册/登录，5分钟内有效。验证码提供给他人可能导致账号被盗，请勿泄漏，谨防被骗。`,
        };
        try {
            const sendEmailResult = await this.sendMailer(mailOptions);
            await this.redisCacheService.set(email, code, 3 * 60 * 1000);
            return sendEmailResult;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 验证邮箱验证码
     */
    public async verifyEmailCode(email: any, value?: any): Promise<string> {
        try {
            return await this.redisCacheService.get(email);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }

    }

    /**
     * 生成key
     */
    public async getAppKeyByEmail( name: string, email: string, expiresTime: string): Promise<any> {
        const jwtAppKeyToken: JwtAppKeyToken = { name, email, overdueTime: expiresTime};
        const expiration: number = moment(expiresTime).valueOf() - moment().valueOf();
        const secret: string = fnv.hash(email, 16).str();
        try {
            const accessToken = await this.jwtService.sign(jwtAppKeyToken, {
                expiresIn: expiration,
            });
            return {expiration, accessToken, secret};
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 插入应用
     * @param params
     */
    public async addAppKey(params: CreateAppKeyDto): Promise<InsertResult> {
        try {
            const logOptions: AppKeyEntity = params as AppKeyEntity;
            delete logOptions.id;
            return await this.appKeyEntityRepository
                .createQueryBuilder('u')
                .insert()
                .into(AppKeyEntity)
                .values([ {
                    isDelete: 0,
                    creatTime: new Date().getTime(),
                    ...logOptions
                }])
                .execute();
        } catch (e) {
            console.log(e);
            throw new ApiException('添加失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 获取应用
     * @param query
     * @param user
     */
    public async getAppKeyList(query: AppKeyGetDto, user: any): Promise<any> {
        try {
            const queryConditionList = ['u.isDelete = :isDelete'];
            if (query.status) queryConditionList.push('u.status = :status');
            if (query.name) queryConditionList.push('u.name LIKE :name');
            if (query.operateUser) queryConditionList.push('u.operateUser = :operateUser');
            const queryCondition = queryConditionList.join(' AND ');
            const res = await this.appKeyEntityRepository
                .createQueryBuilder('u')
                .where(queryCondition, {
                    name: `%${query.name}%`,
                    operateUser: user,
                    isDelete: 0,
                    status: query.status
                })
                .orderBy('u.name', 'ASC')
                .getManyAndCount();
            return  { data: res[0], count: res[1]};
        } catch (e) {
            throw new ApiException('查询失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 删除应用
     * @param params
     */
    public async delAppKey(params: number[]): Promise<any> {
        try {
            return this.appKeyEntityRepository
                .createQueryBuilder('u')
                .update(AppKeyEntity)
                .set({isDelete: 1, deleteTime: new Date().getTime()})
                .whereInIds(params)
                .execute();
        } catch (e) {
            throw new ApiException('编辑失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 唯一性验证
     * @param params
     */
    public async uniqueAppKey(params: UniqueAppKey): Promise<boolean> {
        try {
            const queryObj: any = {};
            if (params.name) {queryObj.name = params.name; }
            if (params.email) {queryObj.email = params.email; }
            const result = await this.appKeyEntityRepository.findOne(queryObj);
            return !!!result;
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 修改系统的配置
     */
    public async editSystemConfig(params: AppTaskConfig): Promise<any> {
        const logOptions: AppTaskConfig = {...params};
        delete logOptions.id;
        try {
            const system: SystemConfigEntity = await this.systemConfigEntityRepository.findOne({CONFIG_NAME: 'LIMIT_CONFIG'})
            if (system) {
                return await this.systemConfigEntityRepository
                    .createQueryBuilder('u')
                    .update(SystemConfigEntity)
                    .set({updateTime: new Date().getTime(), MAX_EMAIL_TOOT_CONFIG_NUM: params.MAX_EMAIL_TOOT_CONFIG_NUM, MAX_ING_TASK: params.MAX_ING_TASK, MAX_MESSAGE_TOOT_CONFIG_NUM: params.MAX_MESSAGE_TOOT_CONFIG_NUM, KAFKA_CONFIG: params.KAFKA_CONFIG, CONFIG_NAME: 'LIMIT_CONFIG',})
                    .where({
                        CONFIG_NAME: 'LIMIT_CONFIG'
                    })
                    .execute();
            }
            return await this.systemConfigEntityRepository
                .createQueryBuilder('u')
                .insert()
                .into(SystemConfigEntity)
                .values([{creatTime: new Date().getTime(), MAX_EMAIL_TOOT_CONFIG_NUM: params.MAX_EMAIL_TOOT_CONFIG_NUM, MAX_ING_TASK: params.MAX_ING_TASK, MAX_MESSAGE_TOOT_CONFIG_NUM: params.MAX_MESSAGE_TOOT_CONFIG_NUM, KAFKA_CONFIG: params.KAFKA_CONFIG, CONFIG_NAME: 'LIMIT_CONFIG',}])
                .execute();
        } catch (e) {
            console.log(e);
            throw new ApiException('添加失败', ApiErrorCode.USER_LIST_FILED, 200);
        }




    }

    /**
     * 获取系统时间限制配置
     * @param name
     */
    public async getSystemConfig(name: string): Promise<SystemConfigEntity> {
        try {
            return await this.systemConfigEntityRepository.findOne({CONFIG_NAME: name})
        }catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}
