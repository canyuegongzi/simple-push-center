import {forwardRef, Module} from '@nestjs/common';
import { NestEventModule } from 'nest-event';
import {HelpService} from "../service/service/HelpService";
import {HelpController} from "../controller/HelpController";

@Module({
    imports: [],
    controllers: [HelpController],
    providers: [HelpService],
    exports: [],
})
export class HelpModule {}
