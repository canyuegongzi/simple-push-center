import { JwtService } from '@nestjs/jwt';
import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {MongoRepository} from 'typeorm';
import {ApiException} from '../../common/error/exceptions/ApiException';
import {ApiErrorCode} from '../../config/ApiErrorCodeEnum';
import {AppKeyEntity} from '../../model/mongoEntity/AppKeyEntity';
import {RedisCacheService} from './RedisCacheService';
import * as nodemailer from 'nodemailer';
import {emailConfig} from '../../config/config.json';
import moment = require('moment');

moment.locale('zh-cn')
import {JwtAppKeyToken} from '../../model/types/JwtAppKeyToken';
import {CreateAppKeyDto} from '../../model/DTO/appKey/CreateAppKeyDto';
import {AppKeyGetDto} from '../../model/DTO/appKey/AppKeyGetDto';
import {UniqueAppKey} from '../../model/DTO/appKey/UniqueAppKey';
import fnv = require('fnv-plus');
import {SystemConfigEntity} from "../../model/mongoEntity/SystemConfigEntity";
import {AppTaskConfig} from "../../model/DTO/task/AppTaskConfig";
@Injectable()
export class AppKeyService {
    constructor(
        @InjectRepository(AppKeyEntity) private readonly appKeyEntityRepository: MongoRepository<AppKeyEntity>,
        @InjectRepository(SystemConfigEntity) private readonly systemConfigEntityRepository: MongoRepository<SystemConfigEntity>,
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
    protected makCode() {
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
    public async sendEmailCode(userName: string, email: string) {
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
            return { success: true, data: sendEmailResult, message: '发送成功', code: 200};
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 验证邮箱验证码
     */
    public async verifyEmailCode(email: any, value: any) {
        try {
            return await this.redisCacheService.get(email);
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }

    }

    /**
     * 生成key
     */
    public async getAppKeyByEmail( name: string, email: string, expiresTime: string) {
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
    public async addAppKey(params: CreateAppKeyDto) {
        try {
            const logOptions: AppKeyEntity = params as AppKeyEntity;
            delete logOptions.id;
            logOptions.creatTime = moment().valueOf();
            return await this.appKeyEntityRepository.insertOne(logOptions);
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 获取应用
     * @param params
     */
    public async getAppKeyList(params: AppKeyGetDto, user: any) {
        const pageSize = Number(params.pageSize);
        const page = Number(params.page);
        const status = params.status;
        const queryObg: any = {};
        if (params.status) {queryObg.status = status; }
        if (user && user.name) {queryObg.operateUser = user.name; }
        if (params.name) {queryObg.name = {$regex: params.name, $options: 'gi'}; }
        try {
            return  await this.appKeyEntityRepository.findAndCount({skip: (page - 1) * pageSize, order: {name: 'DESC'}, take: pageSize, where: queryObg, select: ['creatTime', 'expiresTime', 'id', 'keyValue', 'name', 'operateUser', 'status']});
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 删除应用
     * @param params
     */
    public async delAppKey(params: string) {
        try {
            return  await this.appKeyEntityRepository.deleteOne({name: params});
        } catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200);
        }
    }

    /**
     * 唯一性
     * @param params
     */
    public async uniqueAppKey(params: UniqueAppKey) {
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
     * 唯一性
     * @param params
     */
    public async getInfo(name: string) {
        try {
           return await this.appKeyEntityRepository.findOne({name})
        } catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 修改系统的配置
     */
    public async editSystemConfig(params: AppTaskConfig) {
        try {
            const logOptions: AppTaskConfig = params as AppTaskConfig;
            delete logOptions.id;
            const newOptions = {...logOptions}
            delete newOptions.id;
            await this.systemConfigEntityRepository.updateOne( {CONFIG_NAME: 'LIMIT_CONFIG' }, { $set: newOptions}, { upsert: true});
            return await this.redisCacheService.set('LIMIt_CONFIG', newOptions);
        }catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

    /**
     * 获取系统时间限制配置
     * @param params
     */
    public async getSystemConfig(name: string) {
        try {
            return await this.systemConfigEntityRepository.findOne({CONFIG_NAME: name})
        }catch (e) {
            throw new ApiException(e.message, ApiErrorCode.USER_LIST_FILED, 200);
        }
    }
}
