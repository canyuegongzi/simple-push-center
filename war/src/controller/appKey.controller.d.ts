import { AppKeyService } from '../service/service/appKey.service';
import { GetAppKeyDto } from '../model/DTO/appKey/GetAppKeyDto';
import { AppKeyGetDto } from '../model/DTO/appKey/AppKeyGetDto';
import { CreateAppKeyDto } from '../model/DTO/appKey/CreateAppKeyDto';
import { UniqueAppKey } from '../model/DTO/appKey/UniqueAppKey';
import { UtilService } from '../service/service/util.service';
export declare class AppKeyController {
    private readonly appKeyService;
    private readonly utilService;
    constructor(appKeyService: AppKeyService, utilService: UtilService);
    sendEmailCode(userName: string, email: string): Promise<{
        code: number;
        message: any;
        success: boolean;
    }>;
    verifyEmailCode(email: any, value: any): Promise<boolean | {
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
            data: import("../model/mongoEntity/appKey.entity").AppKeyEntity[];
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
}
