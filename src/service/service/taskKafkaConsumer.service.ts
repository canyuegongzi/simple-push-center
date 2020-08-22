import {Injectable} from '@nestjs/common';
import {AbstractKafkaConsumer} from "../../common/kafka/kafka.abstract.consumer";
import {HELLO_FIXED_TOPIC, TASK_PUSH_INFO} from "../../config/constant";
import {SubscribeTo, SubscribeToFixedGroup} from "../../common/kafka/kafka.decorator";
import {KafkaPayload} from "../../common/kafka/kafka.message";
import moment = require('moment');
import {Emitter, NestEventEmitter} from "nest-event";
moment.locale('zh-cn')

@Injectable()
@Emitter('task-kafka-emitter')
export class TaskKafkaConsumerService extends AbstractKafkaConsumer {

    constructor(private readonly nestEventEmitter: NestEventEmitter) {
        super();

    }
    // 抽象父类必须要实现的方法   注册一个topic
    protected registerTopic() {
        this.addTopic(HELLO_FIXED_TOPIC);
        this.addTopic(TASK_PUSH_INFO);
    }

    @SubscribeTo('task.push.info')
    taskSubscriber(payload: string ) {
        // console.log('kafka接收到了一个新的任务，开始干活了');
        const data: KafkaPayload = JSON.parse(payload);
        // console.log(data);
        this.nestEventEmitter.emitter('task-kafka-emitter').emit('new-kafka-task', data);
    }

    /**
     * When application or container scale up &
     * consumer group id is same for application
     * @param payload
     */
    @SubscribeToFixedGroup(HELLO_FIXED_TOPIC)
    helloSubscriberToFixedGroup(payload: KafkaPayload) {
        // tslint:disable-next-line:no-console
        console.log('[KAKFA-CONSUMER] Print message after receiving for fixed group', payload);
    }
}
