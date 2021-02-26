import { AppKeyService } from '../service/service/AppKeyService';
import { GetAppKeyDto } from '../model/DTO/appKey/GetAppKeyDto';
import { AppKeyGetDto } from '../model/DTO/appKey/AppKeyGetDto';
import { CreateAppKeyDto } from '../model/DTO/appKey/CreateAppKeyDto';
import { UniqueAppKey } from '../model/DTO/appKey/UniqueAppKey';
import { UtilService } from '../service/service/UtilService';
import { AppTaskConfig } from "../model/DTO/task/AppTaskConfig";
export declare class AppKeyController {
    private readonly appKeyService;
    private readonly utilService;
    constructor(appKeyService: AppKeyService, utilService: UtilService);
    sendEmailCode(userName: string, email: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    verifyEmailCode(email: any, value: any): Promise<{
        success: boolean;
        code?: undefined;
        message?: undefined;
    } | {
        code: number;
        message: any;
        success: boolean;
    }>;
    getAppKey(params: GetAppKeyDto): Promise<{
        code: number;
        message: string;
        data: {
            expiration: number;
            accessToken: string;
            secret: string;
        };
        success: boolean;
    } | {
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    }>;
    appKeyList(token: string, params: AppKeyGetDto): Promise<{
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    } | {
        code: number;
        message: string;
        data: {
            data: import("../model/mongoEntity/AppKeyEntity").AppKeyEntity[];
            count: number;
        };
        success: boolean;
    }>;
    addApp(params: CreateAppKeyDto): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    delApp(params: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    uniqueAppKey(params: UniqueAppKey): Promise<boolean | {
        code: number;
        message: any;
        success: boolean;
    }>;
    protected getUser(token: any): Promise<unknown>;
    editSystemConfig(params: AppTaskConfig): Promise<{
        code: number;
        message: string;
        data: void;
        success: boolean;
    } | {
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    }>;
    getSystemConfig(): Promise<{
        code: number;
        message: string;
        data: import("../model/mongoEntity/SystemConfigEntity").SystemConfigEntity;
        success: boolean;
    } | {
        code: number;
        message: any;
        success: boolean;
        data?: undefined;
    }>;
}
