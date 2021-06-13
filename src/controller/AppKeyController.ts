import {Body, Controller, Get, Header, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import {AppKeyService} from '../service/service/AppKeyService';
import {GetAppKeyDto} from '../model/DTO/appKey/GetAppKeyDto';
import {AppKeyGetDto} from '../model/DTO/appKey/AppKeyGetDto';
import {CreateAppKeyDto} from '../model/DTO/appKey/CreateAppKeyDto';
import {UniqueAppKey} from '../model/DTO/appKey/UniqueAppKey';
import {UtilService} from '../service/service/UtilService';
import {AppTaskConfig} from "../model/DTO/task/AppTaskConfig";
import {MessageType, ResultData} from "../common/result/ResultData";

@Controller('app')
export class AppKeyController {
    constructor(@Inject(AppKeyService) private readonly appKeyService: AppKeyService, @Inject(UtilService) private readonly utilService: UtilService) {}

    /**
     * 获取邮箱验证码
     * @param userName
     * @param email
     */
    @Post('getEmailCode')
    public async sendEmailCode(@Body('userName') userName: string, @Body('email') email: string): Promise<ResultData> {
        try {
            await this.appKeyService.sendEmailCode(userName, email );
            return new ResultData(MessageType.GETINFO, true, true);
        } catch (e) {
            return new ResultData(MessageType.GETINFO,  e.errorMessage, false);
        }
    }

    /**
     * 获取邮箱验证码
     * @param email
     * @param value
     */
    @Post('verifyCode')
    public async verifyEmailCode(@Body('email') email: any, @Body('value') value: any): Promise<ResultData> {
        try {
            const res = await this.appKeyService.verifyEmailCode(email, value);
            return new ResultData(MessageType.GETINFO, res === value, true);
        } catch (e) {
            return new ResultData(MessageType.GETINFO,  e.errorMessage, false);
        }
    }

    /**
     * 获取邮箱验证码
     * @param params
     */
    @Post('getKey')
    public async getAppKey(@Body() params: GetAppKeyDto): Promise<ResultData>{
        try {
            const res = await this.appKeyService.getAppKeyByEmail(params.name, params.email, params.expiresTime);
            return new ResultData(MessageType.GETINFO, res, true);
        } catch (e) {
            return new ResultData(MessageType.GETINFO,  e.errorMessage, false);
        }
    }

    /**
     * 获取应用列表
     */
    @Post('list')
    public async appKeyList(@Headers('token') token: string, @Body() params: AppKeyGetDto): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            const res = await this.appKeyService.getAppKeyList(params, user);
            return new ResultData(MessageType.GETLIST, res, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST,  e.errorMessage, false);
        }
    }

    /**
     * 添加应用
     */
    @Post('add')
    public async addApp(@Body() params: CreateAppKeyDto): Promise<ResultData> {
        try {
            await this.appKeyService.addAppKey(params);
            return new ResultData(MessageType.CREATE,  params, true);
        } catch (e) {
            return new ResultData(MessageType.CREATE,  e.errorMessage, false);
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('del')
    public async delApp(@Body('ids') params: number[]): Promise<ResultData> {
        try {
            await this.appKeyService.delAppKey(params);
            return new ResultData(MessageType.DELETE,  params, true);
        } catch (e) {
            return new ResultData(MessageType.DELETE,  e.errorMessage, false);
        }
    }

    /**
     * 唯一性验证
     * @param params
     */
    @Post('uniqueApp')
    public async uniqueAppKey(@Body() params: UniqueAppKey): Promise<ResultData> {
        try {
            const flag: boolean = await this.appKeyService.uniqueAppKey(params);
            return new ResultData(MessageType.DELETE,  flag, true);
        } catch (e) {
            return new ResultData(MessageType.GETINFO,  e.errorMessage, false);
        }
    }

    /**
     * 修改系统的配置
     */
    @Post('systemConfig/edit')
    public async editSystemConfig(@Body() params: AppTaskConfig ): Promise<ResultData> {
        try {
            const res =  await this.appKeyService.editSystemConfig(params);
            return new ResultData(MessageType.UPDATE,  res, true);
        } catch (e) {
            return new ResultData(MessageType.UPDATE,  e.errorMessage, false);
        }
    }

    @Post('systemConfig/info')
    public async getSystemConfig(): Promise<ResultData> {
        try {
            const res = await this.appKeyService.getSystemConfig('LIMIT_CONFIG');
            return new ResultData(MessageType.GETINFO,  res, false);
        } catch (e) {
            return new ResultData(MessageType.GETINFO,  e.errorMessage, false);
        }
    }

}
