import {Inject, Injectable} from '@nestjs/common';
import moment = require('moment');
import {KafkaPayload} from "../../common/kafka/kafka.message";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {InjectRepository} from "@nestjs/typeorm";
import {MongoRepository} from "typeorm";
import {FriendMessageEntity} from "../../model/mongoEntity/friendMessage.entity";
import {GroupMessageEntity} from "../../model/mongoEntity/groupMessage.entity";
import {WsFriendMessageInfo} from "../../model/DTO/ws/WsFriendMessageInfo";
import {ApiException} from "../../common/error/exceptions/api.exception";
import {ApiErrorCode} from "../../config/api-error-code.enum";
import {FriendMessageOffLineEntity} from "../../model/mongoEntity/friendMessageOffLine.entity";
moment.locale('zh-cn');

@Injectable()
export class WebsocketMessageService {

    constructor(
        @InjectRepository(FriendMessageEntity) private readonly friendMessageEntityRepository: MongoRepository<FriendMessageEntity>,
        @InjectRepository(GroupMessageEntity) private readonly groupMessageEntity: MongoRepository<GroupMessageEntity>,
        @InjectRepository(FriendMessageOffLineEntity) private readonly friendMessageOffLineEntity: MongoRepository<FriendMessageOffLineEntity>
    ) {}

    /**
     * 好友消息持久化
     * @param data
     */
    public async friendMessagePersistence(data: WsFriendMessageInfo) {
        try {
            return await this.friendMessageEntityRepository.insertOne({...data})
        }catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200)
        }

    }

    /**
     * 好友消息离线消息存储
     * @param data
     */
    public async friendMessageOffLinePersistence(data: WsFriendMessageInfo) {
        try {
            return await this.friendMessageOffLineEntity.insertOne({...data})
        }catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200)
        }

    }

    /**
     * 删除好友消息离线消息存储
     * @param data
     */
    public async deleteFriendMessageOffLinePersistence(data: WsFriendMessageInfo) {
        try {
            return await this.friendMessageOffLineEntity.deleteOne({ hashId: data.hashId })
        }catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.AUTHORITY_CREATED_FILED, 200)
        }

    }
}
