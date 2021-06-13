import {Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import {EmailGetDto} from '../model/DTO/config/EmailGetDto';
import {CreateEmailConfigDto} from '../model/DTO/config/CreateEmailConfigDto';
import {UtilService} from '../service/service/UtilService';
import {TaskEmailConfigService} from "../service/service/TaskEmailConfigService";
import {MessageType, ResultData} from "../common/result/ResultData";
import {EmailConfigEntity} from "../model/entity/EmailConfigEntity";

@Controller('taskConfig/email')
export class TaskEmailConfigController {
    constructor(
        @Inject(TaskEmailConfigService) private readonly taskConfigService: TaskEmailConfigService,
        @Inject(UtilService) private readonly utilService: UtilService,
    ) {}

    /**
     * 添加邮箱推送配
     * @param params<CreateEmailConfigDto> 配置信息
     * @param token<string> 用户token
     */
    @Post('/add')
    public async addEmailConfig(@Body() params: CreateEmailConfigDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            const info: EmailConfigEntity = {...params, creatTime: new Date().getTime(), operateUser:  user.name} as EmailConfigEntity;
            await this.taskConfigService.addEmailConfig(info);
            return new ResultData(MessageType.CREATE, info, true);
        } catch (e) {
            console.log(e)
            return new ResultData(MessageType.CREATE,  e.errorMessage, false);
        }
    }

    /**
     * 添加邮件推送配置
     * @param params<CreateEmailConfigDto> 配置信息
     * @param token<string> 用户token
     */
    @Post('/update')
    public async editEmailConfig(@Body() params: CreateEmailConfigDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            const info: EmailConfigEntity = {...params, updateTime: new Date().getTime(), operateUser:  user.name} as EmailConfigEntity;
            await this.taskConfigService.editEmailConfig(info);
            return new ResultData(MessageType.UPDATE, params, true);
        } catch (e) {
            return new ResultData(MessageType.UPDATE,  e.errorMessage, false);
        }
    }

    /**
     * 删除邮件推送配置
     * @param params
     */
    @Post('/del')
    public async delEmailConfig(@Body('ids') params: Array<number | string>): Promise<ResultData> {
        try {
            await this.taskConfigService.delEmailConfig(params);
            return new ResultData(MessageType.DELETE, params, true);
        } catch (e) {
            return new ResultData(MessageType.DELETE, e.errorMessage, false);
        }
    }

    /**
     * 查询邮件推送配置
     */
    @Post('/list')
    public async getAllEmailConfig(@Body() params: EmailGetDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            const res = await this.taskConfigService.getAllEmailConfig(params, user);
            return new ResultData(MessageType.GETLIST, res, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }

}
