import { HttpService } from '@nestjs/common';
export declare class CommonHttpService {
    private readonly httpService;
    constructor(httpService: HttpService);
    get(url: string, params: any, headers?: any): Promise<any>;
    post(): Promise<void>;
}
