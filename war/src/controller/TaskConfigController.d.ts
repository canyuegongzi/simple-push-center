import { TaskConfigService } from '../service/service/TaskConfigService';
import { EmailGetDto } from '../model/DTO/config/EmailGetDto';
import { CreateEmailConfigDto } from '../model/DTO/config/CreateEmailConfigDto';
import { MessageGetDto } from '../model/DTO/config/MessageGetDto';
import { CreateMessageConfigDto } from '../model/DTO/config/CreateMessageConfigDto';
import { UtilService } from '../service/service/UtilService';
import { UniqueKey } from '../model/DTO/config/UniqueKey';
import { GetDefaultDto } from "../model/DTO/config/GetDefaultDto";
export declare class TaskConfigController {
    private readonly taskConfigService;
    private readonly utilService;
    constructor(taskConfigService: TaskConfigService, utilService: UtilService);
    addEmailConfig(params: CreateEmailConfigDto, token: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    editEmailConfig(params: CreateEmailConfigDto, token: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    delEmailConfig(params: Array<number | string>): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    getAllEmailConfig(params: EmailGetDto, token: string): Promise<{
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: {
            data: import("../model/mongoEntity/EmailConfigEntity").EmailConfigEntity[];
            count: number;
        };
        success: boolean;
    }>;
    addMessageConfig(params: CreateMessageConfigDto, token: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    editMessageConfig(params: CreateMessageConfigDto, token: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    delMessageConfig(params: Array<number | string>): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    getAllMessageConfig(params: MessageGetDto, token: string): Promise<{
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: {
            data: import("../model/mongoEntity/MessageConfigEntity").MessageConfigEntity[];
            count: number;
        };
        success: boolean;
    }>;
    uniqueAppKey(params: UniqueKey): Promise<boolean | {
        code: number;
        message: any;
        success: boolean;
    }>;
    getDefaultList(params: GetDefaultDto, token: string): Promise<{
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: import("../model/mongoEntity/EmailConfigEntity").EmailConfigEntity[] | import("../model/mongoEntity/MessageConfigEntity").MessageConfigEntity[];
        success: boolean;
    }>;
}
