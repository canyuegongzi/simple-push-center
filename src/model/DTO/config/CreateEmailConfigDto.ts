import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/ApiErrorCodeEnum';

export class CreateEmailConfigDto {
    @IsNotEmpty({ message: 'authUser不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    authUser?: string;

    @IsNotEmpty({ message: 'name不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    name?: string;

    @IsNotEmpty({ message: 'authPass不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    authPass?: string;

    @IsNotEmpty({ message: 'status不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    status?: number;

    @IsNotEmpty({ message: '人员不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    operateUser?: string;

    id?: any;

    host?: string;

    port?: number;

    secure?: string;

    service?: string;

    ignoreTLS?: number;

    isDefault?: number;
}
