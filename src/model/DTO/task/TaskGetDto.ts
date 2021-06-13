import {Type} from "class-transformer";

export class TaskGetDto {

    status?: number;

    from?: string;

    to?: string;

    endTime: number;

    @Type(() => Number)
    page: number;

    @Type(() => Number)
    pageSize: number;

    taskType: number;

    isDelay: number;
}
