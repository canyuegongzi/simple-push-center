import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'task_log'})
export class TaskLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: false, comment: '任务id' })
  taskId: string;

  @Column({ length: 500, nullable: false, comment: '任务code' })
  taskCode: string;

  @Column({default: false, comment: '是否成功' })
  isSuccess: boolean;

  @Column({ comment: '操作时间',  type: "bigint" })
  endTime: number;

  @Column({ comment: '发出人员'})
  from: string;

  @Column({ comment: '目的人员' })
  to: string;

  @Column({ comment: '推送内容' })
  content: string;

  @Column({ comment: '推送内容', type: "text" })
  logging: string;

  @Column({ default: 0, nullable: false, comment: '1: 是 0 否' })
  isDelete: number;

}
