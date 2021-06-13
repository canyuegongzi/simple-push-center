import {Body, Controller, Get, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import {TaskConfigService} from '../service/service/TaskConfigService';
import {EmailGetDto} from '../model/DTO/config/EmailGetDto';
import {CreateEmailConfigDto} from '../model/DTO/config/CreateEmailConfigDto';
import {MessageGetDto} from '../model/DTO/config/MessageGetDto';
import {CreateMessageConfigDto} from '../model/DTO/config/CreateMessageConfigDto';
import {UtilService} from '../service/service/UtilService';
import {UniqueKey} from '../model/DTO/config/UniqueKey';
import {GetDefaultDto} from "../model/DTO/config/GetDefaultDto";

@Controller('taskConfig')
export class TaskConfigController {
    constructor(
        @Inject(TaskConfigService) private readonly taskConfigService: TaskConfigService,
        @Inject(UtilService) private readonly utilService: UtilService,
    ) {}

    /**
     * 添加邮件推送配置
     */
    @Post('email/add')
    public async addEmailConfig(@Body() params: CreateEmailConfigDto, @Headers('token') token: string) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        params.operateUser = user.name;
        try {
            await this.taskConfigService.addEmailConfig(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('email/update')
    public async editEmailConfig(@Body() params: CreateEmailConfigDto, @Headers('token') token: string) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        params.operateUser = user.name;
        try {
            await this.taskConfigService.editEmailConfig(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 删除邮件推送配置
     */
    @Post('email/del')
    public async delEmailConfig(@Body('ids') params: Array<number | string>) {
        try {
            await this.taskConfigService.delEmailConfig(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 查询邮件推送配置
     */
    @Post('email/list')
    public async getAllEmailConfig(@Body() params: EmailGetDto, @Headers('token') token: string) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        try {
            const res = await this.taskConfigService.getAllEmailConfig(params, user);
            return  { code: 200, message: '查询成功', data: res, success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加短信推送配置
     */
    @Post('message/add')
    public async addMessageConfig(@Body() params: CreateMessageConfigDto, @Headers('token') token: string) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        params.operateUser = user.name;
        try {
            await this.taskConfigService.addMessageConfig(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加短信推送配置
     */
    @Post('message/update')
    public async editMessageConfig(@Body() params: CreateMessageConfigDto,  @Headers('token') token: string) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        params.operateUser = user.name;
        try {
            await this.taskConfigService.editMessageConfig(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 删除短信推送配置
     */
    @Post('message/del')
    public async delMessageConfig(@Body('ids') params: Array<number | string>) {
        try {
            await this.taskConfigService.delMessageConfig(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 查询短信推送配置
     */
    @Post('message/list')
    public async getAllMessageConfig(@Body() params: MessageGetDto, @Headers('token') token: string) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        try {
            const res = await this.taskConfigService.getAllMessageConfig(params, user);
            return  { code: 200, message: '查询成功', data: res, success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 唯一性验证
     * @param params
     */
    @Post('uniqueName')
    public async uniqueAppKey(@Body() params: UniqueKey) {
        try {
            return  await this.taskConfigService.uniqueName(params);
        } catch (e) {
            return { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 查询短信推送配置
     */
    @Post('default/list')
    public async getDefaultList(@Body() params: GetDefaultDto, @Headers('token') token: string) {
        let user = null;
        try {
            user = await this.utilService.getUser(token);
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
        try {
            const res = await this.taskConfigService.getDefaultList(params, user);
            return  { code: 200, message: '查询成功', data: res, success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }
}
