import {Module} from '@nestjs/common';
import {HelpService} from "../service/service/HelpService";
import {HelpController} from "../controller/HelpController";

@Module({
    imports: [],
    controllers: [HelpController],
    providers: [HelpService],
    exports: [],
})
export class HelpModule {}
