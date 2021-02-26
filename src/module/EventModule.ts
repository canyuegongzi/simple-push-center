import {forwardRef, Module} from '@nestjs/common';
import { NestEventModule } from 'nest-event';

@Module({
    imports: [NestEventModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class EventModule {}
