import {Body, Controller, Get, Header, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import {AppKeyService} from '../service/service/appKey.service';
import {GetAppKeyDto} from '../model/DTO/appKey/GetAppKeyDto';
import {AppKeyGetDto} from '../model/DTO/appKey/AppKeyGetDto';
import {CreateAppKeyDto} from '../model/DTO/appKey/CreateAppKeyDto';
import {UniqueAppKey} from '../model/DTO/appKey/UniqueAppKey';
import jwt = require('jsonwebtoken');
import {UtilService} from '../service/service/util.service';
import {AppTaskConfig} from "../model/DTO/task/AppTaskConfig";

@Controller('app')
export class AppKeyController {
    constructor(
        @Inject(AppKeyService) private readonly appKeyService: AppKeyService,
        @Inject(UtilService) private readonly utilService: UtilService,
    ) {}

    /**
     * 获取邮箱验证码
     * @param params
     */
    @Post('getEmailCode')
    public async sendEmailCode(@Body('userName') userName: string, @Body('email') email: string) {
        try {
            const res = await this.appKeyService.sendEmailCode(userName, email );
            return { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 获取邮箱验证码
     * @param params
     */
    @Post('verifyCode')
    public async verifyEmailCode(@Body('email') email: any, @Body('value') value: any) {
        try {
            const res = await this.appKeyService.verifyEmailCode(email, value);
            const success = res === value;
            return { success };
        } catch (e) {
            return { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 获取邮箱验证码
     * @param params
     */
    @Post('getKey')
    public async getAppKey(@Body() params: GetAppKeyDto) {
        try {
            const res = await this.appKeyService.getAppKeyByEmail(params.name, params.email, params.expiresTime);
            return { code: 200, message: '操作成功', data: res, success: true };
        } catch (e) {
            return { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 获取应用列表
     */
    @Post('list')
    public async appKeyList(@Headers('token') token: string, @Body() params: AppKeyGetDto) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        try {
            const res = await this.appKeyService.getAppKeyList(params, user);
            return  { code: 200, message: '操作成功', data: { data: res[0], count: res[1] }, success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加应用
     */
    @Post('add')
    public async addApp(@Body() params: CreateAppKeyDto) {
        try {
            await this.appKeyService.addAppKey(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('del')
    public async delApp(@Body('name') params: string) {
        try {
            const res = await this.appKeyService.delAppKey(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 唯一性验证
     * @param params
     */
    @Post('uniqueApp')
    public async uniqueAppKey(@Body() params: UniqueAppKey) {
        try {
            return  await this.appKeyService.uniqueAppKey(params);
        } catch (e) {
            return { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 解析用户
     * @param token
     */
    protected getUser(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'marvin', (error: any, decoded: any) => {
                if (error) {
                    reject('用户无效');
                } else {
                    resolve(decoded);
                }
            });
        });

    }

    /**
     * 修改系统的配置
     */
    @Post('systemConfig/edit')
    public async editSystemConfig(@Body() params: AppTaskConfig ) {
        try {
            const res =  await this.appKeyService.editSystemConfig(params);
            return {code: 200, message: '操作成功', data: res, success: true}
        } catch (e) {
            return { code: 200, message: e.errorMessage, success: false };
        }
    }

    @Post('systemConfig/info')
    public async getSystemConfig() {
        try {
            const res = await this.appKeyService.getSystemConfig('LIMIT_CONFIG');
            return  { code: 200, message: '操作成功', data: res, success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

}
