import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class CreateMessageConfigDto {
    @IsNotEmpty({ message: 'name不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    name?: string;

    @IsNotEmpty({ message: 'status不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    status?: number;
    operateUser?: string;

    @IsNotEmpty({ message: 'secretAccessKey不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    secretAccessKey: string;

    @IsNotEmpty({ message: 'accessKeyId不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    accessKeyId: string;

    @IsNotEmpty({ message: 'signName不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    signName: string;

    @IsNotEmpty({ message: '参数说明不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    paramsNote: string;

    id?: any;

    isDefault?: number;
}
