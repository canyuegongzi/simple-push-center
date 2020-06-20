import {IsNotEmpty} from 'class-validator';
import {ApiErrorCode} from '../../../config/api-error-code.enum';

export class UniqueKey {

    @IsNotEmpty({ message: '类型不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    type?: string;

    name?: string;

    email?: string;
}
