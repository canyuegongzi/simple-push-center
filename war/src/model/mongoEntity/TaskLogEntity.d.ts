import { ObjectID } from 'typeorm';
export declare class TaskLogEntity {
    id: ObjectID;
    taskId: string;
    taskCode: string;
    isSuccess: boolean;
    endTime: number;
    from: string;
    to: string;
    content: string;
    logging: string;
}
