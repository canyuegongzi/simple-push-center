import {IsNotEmpty} from "class-validator";
import {ApiErrorCode} from "../../../config/ApiErrorCodeEnum";

export class AppTaskConfig {
    @IsNotEmpty({ message: 'operateUser不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    MAX_ING_TASK: number;

    @IsNotEmpty({ message: 'operateUser不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    MAX_MESSAGE_TOOT_CONFIG_NUM: number; // 短信推送最大体验次数

    @IsNotEmpty({ message: 'operateUser不能为空', context: { errorCode: ApiErrorCode.USER_NAME_STRING } })
    MAX_EMAIL_TOOT_CONFIG_NUM: number; // 邮件推送最大体验次数

    id?: string;
}
