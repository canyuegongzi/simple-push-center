import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'task'})
export class TaskEntity {
  @ObjectIdColumn()
  id?: string;

  @Column({ length: 500, nullable: false, comment: '任务启动人员' })
  operateUser: string;

  @Column({ length: 500, nullable: false, comment: '任务名' })
  name: string;

  @Column({length: 100, nullable: false, comment: '任务编号' })
  taskCode: string;

  @Column({ default: 0, nullable: false, comment: '任务状态 0 未执行 1 执行中 2 ：执行成功 3 ：执行失败  4： 取消任务' })
  status: number;

  @Column({ default: 1, nullable: false, comment: '任务类型，1： 邮件 2： 短信 3： socket' })
  taskType: number;

  @Column({ nullable: false, comment: '配置' })
  taskConfig: string;

  @Column({ default: 1, nullable: false, comment: '执行类型，1： 单次 2：循环' })
  executeType: number;

  @Column({ default: 0, nullable: false, comment: '执行次数' })
  executeCount: number;

  @Column({ default: 0, nullable: false, comment: '是否延时' })
  isDelay: number;

  @Column({ default: 1, nullable: false, comment: '最大执行次数' })
  maxExecuteCount: number;

  @Column({ comment: '创建时间' })
  startTime: number;

  @Column({ comment: '预计执行时间' })
  predictDealTime: number;

  @Column({ comment: '结束时间(实际执行时间)' })
  endTime: number;

  @Column({ comment: '发出人员', name: 'from' })
  from: string;

  @Column({ comment: '目的人员', name: 'to' })
  to: string;

  @Column({ comment: '推送内容', name: 'content' })
  content: string;

  @Column({ comment: '标题', name: 'title' })
  title: string;

  @Column({ comment: '循环执行时的时间维度'})
  timeType: string;

  @Column({ comment: '循环执行时的时间(05:32)' })
  timeValue: string;

}
