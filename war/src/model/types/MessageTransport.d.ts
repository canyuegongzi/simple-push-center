export interface MessageTransport {
    accessKeyId?: string;
    secretAccessKey?: string;
    sendSMS?: (...args: any[]) => void;
}
