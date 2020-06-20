import { Injectable } from '@nestjs/common';
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
            jwt.verify(token, '', (error: any, decoded: any) => {
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
    public formatAppKey(key: string, secret = '') {
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
}
