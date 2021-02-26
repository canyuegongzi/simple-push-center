import { Injectable } from '@nestjs/common';
/*import { stringify, parse} from 'uuid';*/
import * as uuid from 'uuid';
import jwt = require('jsonwebtoken');
@Injectable()
export class UtilService {
    constructor() {}

    /**
     * 解析用户
     * @param token
     */
    public getUser(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'marvin', (error: any, decoded: any) => {
                if (error) {
                    reject('用户无效');
                } else {
                    resolve(decoded);
                }
            });
        });

    }

    /**
     * 解析app应用信息
     */
    public formatAppKey(key: string, secret = 'marvin-app-key-notice-platform') {
        return new Promise((resolve, reject) => {
            jwt.verify(key, secret, (error: any, decoded: any) => {
                if (error) {
                    reject('用户无效');
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    /**
     * 产生uuid标识
     * @param data
     */
    public createUuid(str: string) {
        console.log(str);
        // const uuidBytes: ArrayLike<number> = this.stringToUint8Array(str);
        // console.log(uuidBytes);
        // return uuid.stringify(uuidBytes);
        return uuid.v1();
    }

    /**
     * 反编译uuid标识
     * @param data
     */
    public parseUuid(uuidStr: any) {
        return uuid.parse(uuidStr);
    }

    /**
     * unit8转化字符串
     * @param fileData
     * @constructor
     */
    public uint8ArrayToString(fileData){
        let dataString = "";
        for (let i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString

    }

    /**
     * 字符串转Uint8Array
     * @param str
     */
    public stringToUint8Array(str){
        const arr = [];
        for (let i = 0, j = str.length; i < j; ++i) {
            arr.push('0x' + str.charCodeAt(i).toString(16));
        }
        // const tmpUint8Array = new Uint8Array(arr);
        return arr;
    }

    /**
     * int转byte[]
     * @param n
     */
    public intToBytes2(n) {
        const bytes = [];
        for (let i = 0; i < 2; i++) {
            bytes[i] = n >> (8 - i * 8);
        }
        return bytes;
    }

    /**
     * string转ArrayBuffer
     * @param str
     */
    public str2ab(str) {
        const buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
        const bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    /**
     * ArrayBuffer转String
     * @param buf
     */
    public ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }
}
