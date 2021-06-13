import {Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import {UtilService} from '../service/service/UtilService';
import {UniqueKey} from '../model/DTO/config/UniqueKey';
import {GetDefaultDto} from "../model/DTO/config/GetDefaultDto";
import {MessageType, ResultData} from "../common/result/ResultData";
import {TaskCommonConfigService} from "../service/service/TaskCommonConfigService";

@Controller('taskConfig/common')
export class TaskCommonConfigController {
    constructor(
        @Inject(TaskCommonConfigService) private readonly taskConfigService: TaskCommonConfigService,
        @Inject(UtilService) private readonly utilService: UtilService,
    ) {}

    /**
     * 查询短信推送配置
     */
    @Post('default/list')
    public async getDefaultList(@Body() params: GetDefaultDto, @Headers('token') token: string): Promise<ResultData> {
        try {
            const res = await this.taskConfigService.getDefaultList(params);
            return new ResultData(MessageType.CREATE, res, true);
        } catch (e) {
            console.log(e);
            return new ResultData(MessageType.CREATE,  e.errorMessage, false);
        }
    }

    /**
     * 唯一性验证
     * @param params
     */
    @Post('uniqueName')
    public async uniqueAppKey(@Body() params: UniqueKey): Promise<ResultData> {
        try {
            const flag: boolean = await this.taskConfigService.uniqueName(params);
            return new ResultData(MessageType.GETINFO, flag, true);
        } catch (e) {
            return new ResultData(MessageType.GETLIST, e.errorMessage, false);
        }
    }
}
