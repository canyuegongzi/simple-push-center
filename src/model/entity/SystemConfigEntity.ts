import {Column, Entity, PrimaryGeneratedColumn,} from 'typeorm';

@Entity({name: 'system_config'})
export class SystemConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'MAX_ING_TASK', default: 20, nullable: false, })
  MAX_ING_TASK: number;

  @Column({ nullable: false, default: 5, comment: 'MAX_MESSAGE_TOOT_CONFIG_NUM' })
  MAX_MESSAGE_TOOT_CONFIG_NUM: number;

  @Column({ nullable: false, default: 50, comment: 'MAX_EMAIL_TOOT_CONFIG_NUM' })
  MAX_EMAIL_TOOT_CONFIG_NUM: number;

  @Column({ comment: 'KAFKA_CONFIG' })
  KAFKA_CONFIG: string;

  @Column({ comment: 'CONFIG_NAME', default: 'LIMIT_CONFIG' })
  CONFIG_NAME: string;

  @Column({ comment: '开始时间', type: "bigint" })
  creatTime: number;

  @Column({ comment: '更新时间', nullable: true,  type: "bigint" })
  updateTime: number;

  @Column({ comment: '删除时间', nullable: true,  type: "bigint" })
  deleteTime: number;

  @Column({ default: 0, nullable: false, comment: '1: 是 0 否' })
  isDelete: number;

}
