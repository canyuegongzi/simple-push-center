import { TaskService } from '../service/service/task.service';
import { CreateEmailTaskDto } from '../model/DTO/task/CreateEmailTaskDto';
import { CancleEmailTaskDto } from '../model/DTO/task/CancleEmailTaskDto';
import { TaskGetDto } from '../model/DTO/task/TaskGetDto';
import { TaskLogService } from '../service/service/taskLog.service';
import { UtilService } from '../service/service/util.service';
import { TaskConfigService } from '../service/service/taskConfig.service';
import { CreateEmailConfigDto } from '../model/DTO/config/CreateEmailConfigDto';
import { EmailGetDto } from '../model/DTO/config/EmailGetDto';
import { CreateMessageConfigDto } from '../model/DTO/config/CreateMessageConfigDto';
import { MessageGetDto } from '../model/DTO/config/MessageGetDto';
import { UniqueKey } from '../model/DTO/config/UniqueKey';
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
            data: import("../model/mongoEntity/task.entity").TaskEntity[];
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
            data: import("../model/mongoEntity/taskLog.entity").TaskLogEntity[];
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
            data: import("../model/mongoEntity/taskLog.entity").TaskLogEntity[];
            count: number;
        };
        success: boolean;
    } | {
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    }>;
    authApp(key: string, expiresTime: string): Promise<boolean | {
        code: number;
        message: any;
        success: boolean;
    }>;
    canSubmit(key: string, expiresTime: string): Promise<any>;
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
            data: import("../model/mongoEntity/emailConfig.entity").EmailConfigEntity[];
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
            data: import("../model/mongoEntity/messageConfig.entity").MessageConfigEntity[];
            count: number;
        };
        success: boolean;
    }>;
    uniqueAppKey(params: UniqueKey): Promise<boolean | {
        code: number;
        message: any;
        success: boolean;
    }>;
}
