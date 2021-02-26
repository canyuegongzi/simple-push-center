import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class GetAppKeyDto {
    @IsNotEmpty({ message: '应用名不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    name?: string;

    @IsNotEmpty({ message: '邮箱不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    email?: string;

    @IsNotEmpty({ message: '过期时间不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    expiresTime: string;
}
