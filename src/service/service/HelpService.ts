import {Injectable} from "@nestjs/common";

@Injectable()
export class HelpService {
    constructor() {}

    /**
     * 加载详情
     */
    public async getHelpInfo() {
        return '5555'
    }
}
