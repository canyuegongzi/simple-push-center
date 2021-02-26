import { DynamicModule } from '@nestjs/common';
import { KafkaConfig } from './KafkaMessage';
export declare class KafkaModule {
    static register(kafkaConfig: KafkaConfig): DynamicModule;
}
