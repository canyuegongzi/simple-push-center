import {Body, Controller, Get, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import {TaskService} from '../service/service/TaskService';
import {CreateEmailTaskDto} from '../model/DTO/task/CreateEmailTaskDto';
import {CancleEmailTaskDto} from '../model/DTO/task/CancleEmailTaskDto';
import {TaskGetDto} from '../model/DTO/task/TaskGetDto';
import {TaskLogService} from '../service/service/TaskLogService';
import {UtilService} from '../service/service/UtilService';
import {TaskConfigService} from '../service/service/TaskConfigService';
import {CreateEmailConfigDto} from '../model/DTO/config/CreateEmailConfigDto';
import {EmailGetDto} from '../model/DTO/config/EmailGetDto';
import {CreateMessageConfigDto} from '../model/DTO/config/CreateMessageConfigDto';
import {MessageGetDto} from '../model/DTO/config/MessageGetDto';
import {UniqueKey} from '../model/DTO/config/UniqueKey';
import {GetDefaultDto} from "../model/DTO/config/GetDefaultDto";
import moment = require("moment");
moment.locale('zh-cn')

@Controller('task')
export class TaskController {
    constructor(
        @Inject(TaskService) private readonly taskService: TaskService,
        @Inject(TaskLogService) private readonly taskLogService: TaskLogService,
        @Inject(UtilService) private readonly utilService: UtilService,
        @Inject(TaskConfigService) private readonly taskConfigService: TaskConfigService,
    ) {}

    /**
     * 添加邮件推送配置
     */
    @Post('email/add')
    public async addEmailTask(@Body() params: CreateEmailTaskDto) {
        try {
            await this.taskService.addEmailTask(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加信息推送配置
     */
    @Post('message/add')
    public async addMessageTask(@Body() params: CreateEmailTaskDto) {
        try {
            await this.taskService.addMessageTask(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('cancle')
    public async cancleEmailTask(@Body() params: CancleEmailTaskDto) {
        try {
            await this.taskService.cancleEmailTask(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('list')
    public async taskList(@Body() params: TaskGetDto) {
        try {
            const res = await this.taskService.taskList(params);
            return  { code: 200, message: '操作成功', data: { data: res[0], count: res[1] }, success: true };
        } catch (e) {
            console.log(e)
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('del')
    public async deleteTask(@Body('taskCode') params: string) {
        try {
            const res = await this.taskService.deleteTask(params);
            return  { code: 200, message: '操作成功', success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('log/list')
    public async logList(@Body() params: TaskGetDto) {
        try {
            const res = await this.taskLogService.getLogList(params);
            return  { code: 200, message: '操作成功', data: { data: res[0], count: res[1] }, success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('log/info')
    public async taskLogInfo(@Body('taskCode') params: string) {
        try {
            const res = await this.taskLogService.getLogInfo(params);
            return  { code: 200, message: '操作成功', data: {data: res[0], count: res[1]}, success: true };
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 鉴权用户
     */
    @Post('auth/app')
    public async authApp(@Body('key') key: string, @Body('expiresTime') expiresTime: string, @Body('name') name: string) {
        try {
            const appInfo: any = await this.utilService.formatAppKey(key);
            const flag: boolean = moment(appInfo.overdueTime).valueOf() > moment().valueOf()
            return flag;
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 鉴权用户
     */
    @Post('can/submit')
    public async canSubmit(
        @Body('key') key: string,
        @Body('expiresTime') expiresTime: string,
        @Body('submitType') submitType = '1',
        @Body('taskType') taskType: string,
        @Headers('token') token: string) {
        try {
            const flag: any = await this.taskService.canSubmit(key, expiresTime, taskType, token, submitType);
            return flag;
        } catch (e) {
            return  { code: 200, message: e.errorMessage, success: false };
        }
    }

    /**
     * 添加邮件推送配置
     */
    @Post('taskConfig/email/add')
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
    @Post('taskConfig/email/update')
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
    @Post('taskConfig/email/del')
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
    @Post('taskConfig/email/list')
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
    @Post('taskConfig/message/add')
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
    @Post('taskConfig/message/update')
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
    @Post('taskConfig/message/del')
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
    @Post('taskConfig/message/list')
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
    @Post('taskConfig/uniqueName')
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
    @Post('taskConfig/default/list')
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
