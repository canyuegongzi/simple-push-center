import { TaskService } from '../service/service/TaskService';
import { CreateEmailTaskDto } from '../model/DTO/task/CreateEmailTaskDto';
import { CancleEmailTaskDto } from '../model/DTO/task/CancleEmailTaskDto';
import { TaskGetDto } from '../model/DTO/task/TaskGetDto';
import { TaskLogService } from '../service/service/TaskLogService';
import { UtilService } from '../service/service/UtilService';
import { TaskConfigService } from '../service/service/TaskConfigService';
import { CreateEmailConfigDto } from '../model/DTO/config/CreateEmailConfigDto';
import { EmailGetDto } from '../model/DTO/config/EmailGetDto';
import { CreateMessageConfigDto } from '../model/DTO/config/CreateMessageConfigDto';
import { MessageGetDto } from '../model/DTO/config/MessageGetDto';
import { UniqueKey } from '../model/DTO/config/UniqueKey';
import { GetDefaultDto } from "../model/DTO/config/GetDefaultDto";
export declare class TaskController {
    private readonly taskService;
    private readonly taskLogService;
    private readonly utilService;
    private readonly taskConfigService;
    constructor(taskService: TaskService, taskLogService: TaskLogService, utilService: UtilService, taskConfigService: TaskConfigService);
    addEmailTask(params: CreateEmailTaskDto): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    addMessageTask(params: CreateEmailTaskDto): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    cancleEmailTask(params: CancleEmailTaskDto): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    taskList(params: TaskGetDto): Promise<{
        code: number;
        message: string;
        data: {
            data: import("../model/mongoEntity/TaskEntity").TaskEntity[];
            count: number;
        };
        success: boolean;
    } | {
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    }>;
    deleteTask(params: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    logList(params: TaskGetDto): Promise<{
        code: number;
        message: string;
        data: {
            data: import("../model/mongoEntity/TaskLogEntity").TaskLogEntity[];
            count: number;
        };
        success: boolean;
    } | {
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    }>;
    taskLogInfo(params: string): Promise<{
        code: number;
        message: string;
        data: {
            data: import("../model/mongoEntity/TaskLogEntity").TaskLogEntity[];
            count: number;
        };
        success: boolean;
    } | {
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    }>;
    authApp(key: string, expiresTime: string, name: string): Promise<boolean | {
        code: number;
        message: any;
        success: boolean;
    }>;
    canSubmit(key: string, expiresTime: string, submitType: string, taskType: string, token: string): Promise<any>;
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
