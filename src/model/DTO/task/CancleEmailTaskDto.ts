import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class CancleEmailTaskDto {
    taskCode: number | string;
}
