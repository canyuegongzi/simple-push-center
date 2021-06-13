import {Body, Controller, Headers, Inject, Post} from '@nestjs/common';
import moment = require("moment");
import {UtilService} from "../service/service/UtilService";
import {TaskMainService} from "../service/service/TaskMainService";
import {TaskMessageConfigService} from "../service/service/TaskMessageConfigService";
import {TaskEmailConfigService} from "../service/service/TaskEmailConfigService";
import {MessageType, ResultData} from "../common/result/ResultData";
import {CreateEmailTaskDto} from "../model/DTO/task/CreateEmailTaskDto";
import {TaskGetDto} from "../model/DTO/task/TaskGetDto";
import {TaskLogService} from "../service/service/TaskLogService";
import {LogGetDto} from "../model/DTO/log/LogGetDto";
import {CancleEmailTaskDto} from "../model/DTO/task/CancleEmailTaskDto";
import {CreateMessageConfigDto} from "../model/DTO/config/CreateMessageConfigDto";
moment.locale('zh-cn')

@Controller('task')
export class TaskMainController {
    constructor(
        @Inject(TaskLogService) private readonly taskLogService: TaskLogService,
        @Inject(TaskMainService) private readonly taskMainService: TaskMainService,
        @Inject(UtilService) private readonly utilService: UtilService,
        @Inject(TaskMessageConfigService) private readonly taskMessageConfigService: TaskMessageConfigService,
        @Inject(TaskEmailConfigService) private readonly taskEmailConfigService: TaskEmailConfigService,
    ) {}

    /**
     * 鉴权应用
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
     * 启动任务前鉴权任务
     * @param key
     * @param expiresTime
     * @param submitType
     * @param taskType
     * @param token
     */
    @Post('can/submit')
    public async canSubmit(@Body('key') key: string, @Body('expiresTime') expiresTime: string, @Body('submitType') submitType = 1, @Body('taskType') taskType: number, @Headers('token') token: string) {
        try {
            const flag: boolean = await this.taskMainService.canSubmit(key, expiresTime, Number(taskType), token, Number(submitType));
            return new ResultData(MessageType.GETLIST,flag, true);
        } catch (e) {
            return new ResultData(MessageType.GETINFO, e.errorMessage, false);
        }
    }

    /**
     * 邮件推送配置新增
     * @param params<CreateEmailTaskDto>
     * @param token
     */
    @Post('email/add')
    public async addEmailTask(@Body() params: CreateEmailTaskDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            if (user) {
                params.operateUser = user.name;
            }
            await this.taskMainService.addEmailTask(params);
            return new ResultData(MessageType.GETLIST, params, true);
        } catch (e) {
            console.log(e);
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }

    /**
     * 短信推送配置新增
     * @param params<CreateEmailTaskDto>
     * @param token
     */
    @Post('message/add')
    public async addMessageTask(@Body() params: CreateEmailTaskDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            if (user) {
                params.operateUser = user.name;
            }
            await this.taskMainService.addMessageTask(params);
            return new ResultData(MessageType.GETLIST, params, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }

    /**
     * 任务日志列表
     */
    @Post('log/list')
    public async logList(@Body() params: LogGetDto): Promise<ResultData> {
        try {
            const res = await this.taskLogService.getLogList(params);
            return new ResultData(MessageType.GETLIST, res, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }

    /**
     * 任务日志详情
     */
    @Post('log/info')
    public async taskLogInfo(@Body('taskCode') params: string): Promise<ResultData> {
        try {
            const res = await this.taskLogService.getLogInfo(params);
            return new ResultData(MessageType.GETLIST, res, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }

    /**
     * 获取任务列表
     */
    @Post('list')
    public async taskList(@Body() params: TaskGetDto): Promise<ResultData> {
        try {
            const res = await this.taskMainService.taskList(params);
            return new ResultData(MessageType.GETLIST, res, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }

    /**
     * 删除任务
     */
    @Post('del')
    public async deleteTask(@Body('id') params: number): Promise<ResultData> {
        try {
            await this.taskMainService.deleteTask(params);
            return new ResultData(MessageType.GETLIST, true, true);
        } catch (e) {
            return new ResultData(MessageType.DELETE, e.errorMessage, false);
        }
    }

    /**
     * 任务取消
     * @param params
     */
    @Post('cancle')
    public async cancleEmailTask(@Body() params: CancleEmailTaskDto): Promise<ResultData> {
        try {
            await this.taskMainService.cancleEmailTask(params);
            return new ResultData(MessageType.UPDATE, true, true);
        } catch (e) {
            return new ResultData(MessageType.DELETE, e.errorMessage, false);
        }
    }
}
