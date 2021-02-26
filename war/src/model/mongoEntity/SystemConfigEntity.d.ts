import { ObjectID } from 'typeorm';
export declare class SystemConfigEntity {
    id: ObjectID;
    MAX_ING_TASK: number;
    MAX_MESSAGE_TOOT_CONFIG_NUM: number;
    MAX_EMAIL_TOOT_CONFIG_NUM: string;
    KAFKA_CONFIG: string;
    CONFIG_NAME: string;
}
