import { HelpService } from "../service/service/HelpService";
export declare class HelpController {
    private readonly helpService;
    private helpMd;
    constructor(helpService: HelpService);
    sendToConsumer(): Promise<any>;
    loadHelpMd(): Promise<unknown>;
}
