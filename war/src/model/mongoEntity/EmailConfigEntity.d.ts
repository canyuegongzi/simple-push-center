import { ObjectID } from 'typeorm';
export declare class EmailConfigEntity {
    id: ObjectID;
    name: string;
    operateUser: string;
    host: string;
    port: number;
    secure: string;
    service: string;
    ignoreTLS: number;
    authUser: string;
    authPass: string;
    status: number;
    isDefault: number;
}
