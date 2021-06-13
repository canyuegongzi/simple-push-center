import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'app_key'})
export class AppKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '应用名' })
  name: string;

  @Column({ length: 500, nullable: false, comment: '操作人员' })
  operateUser: string;

  @Column({ comment: '应用key' })
  keyValue: string;

  @Column({ comment: '过期时间' })
  expiresTime: string;

  @Column({ comment: '状态' })
  status: boolean;

  @Column({ default: 0, nullable: false, comment: '1: 是 0 否' })
  isDelete: number;

  @Column({ comment: '开始时间', type: "bigint" })
  creatTime: number;

  @Column({ comment: '更新时间', nullable: true, type: "bigint" })
  updateTime: number;

  @Column({ comment: '删除时间', nullable: true,  type: "bigint" })
  deleteTime: number;

  @Column({ comment: '开始时间' })
  secret: string;

}
