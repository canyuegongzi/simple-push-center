import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/api-error-code.enum';

export class CancleEmailTaskDto {
    taskCode: number | string;
}
