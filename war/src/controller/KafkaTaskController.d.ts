import { TaskKafkaProductService } from "../service/service/TaskKafkaProductService";
import { KafkaTaskDto } from "../model/DTO/kafka/KafkaTaskDto";
export declare class KafkaTaskController {
    private readonly taskKafkaProductService;
    constructor(taskKafkaProductService: TaskKafkaProductService);
    sendToConsumer(): Promise<{
        value: string;
    }>;
    kafkaEmitNewTask(kafkaTaskDto: KafkaTaskDto): Promise<void | import("kafkajs").RecordMetadata[]>;
}
