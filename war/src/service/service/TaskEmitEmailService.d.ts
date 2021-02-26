import { MailerTransport } from '../../model/types/MailerTransport';
import { SendMailerOptions } from '../../model/types/SendMailerOptions';
export declare class TaskEmitEmailService {
    private readonly logger;
    constructor();
    createTransport(mailerTransport: MailerTransport): Promise<MailerTransport>;
    sendMailer(sendMailerOptions: SendMailerOptions, transporter: MailerTransport): Promise<{
        response: any;
        isSuccess: boolean;
    }>;
    init(): void;
}
