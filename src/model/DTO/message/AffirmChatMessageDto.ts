export class AffirmChatMessageDto {
    messageType: ['FRIEND' | 'GROUP' | 'SYSTEM', 'OTHER'];

    messageId: string;

    hashId: string;
}
