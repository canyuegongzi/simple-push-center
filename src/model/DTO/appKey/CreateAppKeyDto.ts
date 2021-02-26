import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class CreateAppKeyDto {

    id?: any;
    @IsNotEmpty({ message: 'status不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    status?: boolean;

    @IsNotEmpty({ message: '人员不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    operateUser?: string;

    @IsNotEmpty({ message: '应用名不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    name?: string;

    @IsNotEmpty({ message: '应用key不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    keyValue?: string;

    @IsNotEmpty({ message: '过期时间不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    expiresTime?: string;

    @IsNotEmpty({ message: 'secret不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    secret: string;
}
