import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class RequestAddFriendDto {
    id?: number;

    @IsNotEmpty({ message: '目标id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    targetId: string;

    @IsNotEmpty({ message: '请求来源id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    formId: string;

    @IsNotEmpty({ message: '请求类型不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    type: string;

    note: string;

    state: boolean;

    callBackType: number;
}
