import {Body, Controller, Get, Header, Headers, Inject, Post, Query, UseInterceptors} from '@nestjs/common';
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
    async sendToConsumer() {
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
    async loadHelpMd() {
        return new Promise((async (resolve, reject) => {
            fs.readFile(__dirname+'/help.md', function(err, data){
                if(err){
                    console.log("文件不存在！");
                    reject('文件不存在')
                }else{
                    console.log(data);
                    const mdStr = marked(data.toString());
                    resolve(mdStr);
                }
            });
        }))

    }

}
