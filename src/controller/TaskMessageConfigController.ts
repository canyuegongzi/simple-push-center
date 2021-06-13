import {Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import {UtilService} from '../service/service/UtilService';
import {MessageType, ResultData} from "../common/result/ResultData";
import {TaskMessageConfigService} from "../service/service/TaskMessageConfigService";
import {CreateMessageConfigDto} from "../model/DTO/config/CreateMessageConfigDto";
import {MessageGetDto} from "../model/DTO/config/MessageGetDto";
import {MessageConfigEntity} from "../model/entity/MessageConfigEntity";

@Controller('taskConfig/message')
export class TaskMessageConfigController {
    constructor(
        @Inject(TaskMessageConfigService) private readonly taskConfigService: TaskMessageConfigService,
        @Inject(UtilService) private readonly utilService: UtilService,
    ) {}

    /**
     * 添加短信推送配
     * @param params<CreateMessageConfigDto> 配置信息
     * @param token<string> 用户token
     */
    @Post('/add')
    public async addConfig(@Body() params: CreateMessageConfigDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            const info: CreateMessageConfigDto = {...params, creatTime: new Date().getTime(), operateUser:  user.name} as MessageConfigEntity;
            await this.taskConfigService.addConfig(info);
            return new ResultData(MessageType.CREATE, info, true);
        } catch (e) {
            return new ResultData(MessageType.CREATE,  e.errorMessage, false);
        }
    }

    /**
     * 添加短信推送配置
     * @param params<CreateMessageConfigDto> 配置信息
     * @param token<string> 用户token
     */
    @Post('/update')
    public async editConfig(@Body() params: CreateMessageConfigDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            const info: CreateMessageConfigDto = {...params, updateTime: new Date().getTime(), operateUser:  user.name} as MessageConfigEntity;
            await this.taskConfigService.editConfig(info);
            return new ResultData(MessageType.UPDATE, params, true);
        } catch (e) {
            return new ResultData(MessageType.UPDATE,  e.errorMessage, false);
        }
    }

    /**
     * 删除短信推送配置
     * @param params
     */
    @Post('/del')
    public async delConfig(@Body('ids') params: Array<number | string>): Promise<ResultData> {
        try {
            await this.taskConfigService.delConfig(params);
            return new ResultData(MessageType.DELETE, params, true);
        } catch (e) {
            return new ResultData(MessageType.DELETE, e.errorMessage, false);
        }
    }

    /**
     * 查询短信推送配置
     */
    @Post('/list')
    public async getAllConfig(@Body() params: MessageGetDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const user: Record<string, any> = await this.utilService.getUser(token);
            const res = await this.taskConfigService.getAllConfig(params, user);
            return new ResultData(MessageType.GETLIST, res, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }

}
