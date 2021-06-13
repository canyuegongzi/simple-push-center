import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';
import {Type} from "class-transformer";

export class CancleEmailTaskDto {
    taskCode: number | string;

    @Type(() => Number)
    id: number
}
