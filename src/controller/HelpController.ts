import {Controller, Get, Inject} from '@nestjs/common';
import {HelpService} from "../service/service/HelpService";
import * as fs from "fs";
import marked = require("marked");
@Controller('help')
export class HelpController {
    private helpMd: string;
    constructor(
        @Inject(HelpService) private readonly helpService: HelpService,
    ) {
    }

    @Get('/info')
    async sendToConsumer(): Promise<string> {
        try {
            const mdStr = await this.loadHelpMd();
            const htmlStr = marked(mdStr)
            return htmlStr;
        }catch (e) {
            console.log(e)
        }

    }

    /**
     * 加载帮助
     */
    async loadHelpMd(): Promise<any>{
        return new Promise((async (resolve, reject) => {
            fs.readFile(__dirname+'/help.md', function(err, data){
                if(err){
                    reject('文件不存在')
                }else{
                    const mdStr = marked(data.toString());
                    resolve(mdStr);
                }
            });
        }))

    }

}
