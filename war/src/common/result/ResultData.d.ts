interface ReturnData {
    [type: string]: any;
}
export declare enum MessageType {
    GETLIST = 0,
    DELETE = 1,
    GETINFO = 2,
    CREATE = 3,
    UPDATE = 4,
    FILEERROR = 5,
    OPERATE = 6
}
export declare class ResultData {
    code: number;
    message: string;
    data: ReturnData;
    success: boolean;
    constructor(messageType: MessageType, data?: any, success?: boolean);
}
export {};
