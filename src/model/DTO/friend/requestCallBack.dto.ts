import {IsNotEmpty} from 'class-validator';
import { ApiErrorCode } from '../../../config/api-error-code.enum';

export class RequestCallBackDto {
    @IsNotEmpty({ message: 'id不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    id?: number;

    @IsNotEmpty({ message: '反馈结果不能为空', context: { errorCode: ApiErrorCode.PARAMS_DELETIONl } })
    callBackType: number; // 1 未应答 2： 同意  3： 不同意
}
