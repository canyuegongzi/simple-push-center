import {forwardRef, Module} from '@nestjs/common';
import { NestEventModule } from 'nest-event';
import {HelpService} from "../service/service/help.service";
import {HelpController} from "../controller/help.controller";

@Module({
    imports: [],
    controllers: [HelpController],
    providers: [HelpService],
    exports: [],
})
export class HelpModule {}
