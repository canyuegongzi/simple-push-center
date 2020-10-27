import {Body, Controller, Get, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
import moment = require("moment");
import {AmqpMessageProductService} from "../service/service/amqpMessageProduct.service";
import {MessageType, ResultData} from "../common/result/ResultData";
import {WebsocketMessageService} from "../service/service/websocketMessage.service";
import {WsFriendMessageInfo} from "../model/DTO/ws/WsFriendMessageInfo";
import {UtilService} from "../service/service/util.service";
import {RequestAddFriendDto} from "../model/DTO/friend/requestAddFriend.dto";
moment.locale('zh-cn')

/**
 * 即时消息推送控制器
 */
@Controller('amqpMessage')
export class AmqpMessageController {
    constructor(
        @Inject(AmqpMessageProductService) private readonly amqpMessageProductService: AmqpMessageProductService,
        @Inject(WebsocketMessageService) private readonly websocketMessageService: WebsocketMessageService,
        @Inject(UtilService) private readonly utilService: UtilService,
    ) {
        console.log(225);
    }

    /**
     * 发送新的好友消息
     * @param amqpMessageDto
     */
    @Post('newMessage')
    public async amqpEmitNewTask(@Body() amqpMessageDto: WsFriendMessageInfo): Promise<ResultData> {
        try {
            const currentTime: number = new Date().getTime();
            const messageStr: string = amqpMessageDto.userId + '_' + amqpMessageDto.friendId + '_' + currentTime;
            const hashId: string = this.utilService.createUuid(messageStr);
            // 离线库消息持久化
            await this.websocketMessageService.friendMessageOffLinePersistence({ ...amqpMessageDto, hashId: hashId });
            // 先进行消息持久化
            await this.websocketMessageService.friendMessagePersistence({ ...amqpMessageDto, hashId: hashId });
            console.log('消息持久化成功');
            // 广播消息
            await this.amqpMessageProductService.sendFriendMessage({ ...amqpMessageDto, hashId: hashId });
            return new ResultData(MessageType.OPERATE,  { hashId: hashId }, true)
        }catch (e) {
            console.log(e);
            return new ResultData(MessageType.OPERATE,  e, false)
        }
    }

    /**
     * 确认好友已经收到消息
     * @param amqpMessageDto
     */
    @Post('affirmFrMessage')
    public async affirmFrMessage(@Body() amqpMessageDto: WsFriendMessageInfo): Promise<ResultData> {
        try {
            await this.websocketMessageService.deleteFriendMessageOffLinePersistence(amqpMessageDto);
            return new ResultData(MessageType.OPERATE,  amqpMessageDto, true)
        }catch (e) {
            return new ResultData(MessageType.OPERATE,  null, false)
        }
    }

    /**
     * 好友请求
     * @param requestAddFriendDto
     */
    @Post('newFriendRequest')
    public async newFriendRequest(@Body() requestAddFriendDto: RequestAddFriendDto): Promise<ResultData> {
        try {
            await this.amqpMessageProductService.newRequest(requestAddFriendDto);
            return new ResultData(MessageType.OPERATE,  true, true)
        }catch (e) {
            return new ResultData(MessageType.OPERATE,  false, false)
        }
    }
}
