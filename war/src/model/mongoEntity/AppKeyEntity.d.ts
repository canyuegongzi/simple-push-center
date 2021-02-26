import { ObjectID } from 'typeorm';
export declare class AppKeyEntity {
    id: ObjectID;
    name: string;
    operateUser: string;
    keyValue: string;
    expiresTime: string;
    status: boolean;
    creatTime?: number;
    secret: string;
}
