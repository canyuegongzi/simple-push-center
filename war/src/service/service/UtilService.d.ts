export declare class UtilService {
    constructor();
    getUser(token: any): Promise<unknown>;
    formatAppKey(key: string, secret?: string): Promise<unknown>;
    createUuid(str: string): string;
    parseUuid(uuidStr: any): ArrayLike<number>;
    uint8ArrayToString(fileData: any): string;
    stringToUint8Array(str: any): any[];
    intToBytes2(n: any): any[];
    str2ab(str: any): ArrayBuffer;
    ab2str(buf: any): any;
}
