import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity({name: 'system_config'})
export class SystemConfigEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ comment: 'MAX_ING_TASK', default: 20, nullable: false, })
  MAX_ING_TASK: number;

  @Column({ nullable: false, default: 5, comment: 'MAX_MESSAGE_TOOT_CONFIG_NUM' })
  MAX_MESSAGE_TOOT_CONFIG_NUM: number;

  @Column({ nullable: false, default: 50, comment: 'MAX_EMAIL_TOOT_CONFIG_NUM' })
  MAX_EMAIL_TOOT_CONFIG_NUM: string;

  @Column({ comment: 'KAFKA_CONFIG' })
  KAFKA_CONFIG: string;

  @Column({ comment: 'CONFIG_NAME', default: 'LIMIT_CONFIG' })
  CONFIG_NAME: string;

}
