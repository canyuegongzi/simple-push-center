import { AbstractKafkaConsumer } from "../../common/kafka/KafkaAbstractConsumer";
import { KafkaPayload } from "../../common/kafka/KafkaMessage";
import { NestEventEmitter } from "nest-event";
export declare class TaskKafkaConsumerService extends AbstractKafkaConsumer {
    private readonly nestEventEmitter;
    constructor(nestEventEmitter: NestEventEmitter);
    protected registerTopic(): void;
    taskSubscriber(payload: string): void;
    helloSubscriberToFixedGroup(payload: KafkaPayload): void;
}
