import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';
import {Type} from "class-transformer";

export class CreateLogDto {
    @IsNotEmpty({ message: 'operateUser不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    taskId: any;

    taskCode: any;
    isSuccess: boolean;

    endTime: number;

    from: string;

    to: string;

    content: string;

    logging: string;

    errmessage: string;

    @Type(() => Number)
    id?: any;

}
