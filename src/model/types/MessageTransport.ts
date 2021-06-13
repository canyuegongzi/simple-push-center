export interface MessageTransport {
    accessKeyId?: string;
    secretAccessKey?: string;
    sendSms?: (...args: any[]) => Promise<any>;
}
