import { MessageTransport } from '../../model/types/MessageTransport';
import { SendMessageOptions } from '../../model/types/SendMessageOptions';
export declare class TaskEmitMessageService {
    private readonly logger;
    constructor();
    createTransport(messageTransport: MessageTransport): Promise<MessageTransport>;
    sendMessage(sendMessageOptions: SendMessageOptions, transporter: MessageTransport): Promise<{
        response: any;
        isSuccess: boolean;
    }>;
    init(): void;
}
