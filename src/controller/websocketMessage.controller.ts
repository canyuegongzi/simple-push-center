import {Body, Controller, Get, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import moment = require("moment");
import {MessageType, ResultData} from "../common/result/ResultData";
import {WebsocketMessageService} from "../service/service/websocketMessage.service";
import {UtilService} from "../service/service/util.service";
import {GetMessageQueryDto} from "../model/DTO/message/GetMessageQueryDto";
moment.locale('zh-cn');

/**
 * 聊天日志控制器
 */
@Controller('websocketMessage')
export class WebsocketMessageController {
    constructor(
        @Inject(WebsocketMessageService) private readonly websocketMessageService: WebsocketMessageService,
        @Inject(UtilService) private readonly utilService: UtilService,
    ) {}

    /**
     * 获取好友聊天记录
     * @param amqpMessageDto
     */
    @Get('friendMessage')
    public async getFriendMessageList(@Body() messageQueryDto: GetMessageQueryDto): Promise<ResultData> {
        try {
            const data: any = await this.websocketMessageService.getFriendMessageList(messageQueryDto);
            return new ResultData(MessageType.OPERATE,  data, true)
        }catch (e) {
            console.log(e);
            return new ResultData(MessageType.OPERATE,  e, false)
        }
    }
}
