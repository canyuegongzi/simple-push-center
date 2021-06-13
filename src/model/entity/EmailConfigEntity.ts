import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'email_config'})
export class EmailConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '邮件配置名称', name: 'name' })
  name: string;

  @Column({ length: 500, nullable: false, comment: '操作人员' })
  operateUser: string;

  @Column({ comment: 'host', name: 'host' })
  host: string;

  @Column({ comment: '邮箱推送配置端口', name: 'port' })
  port: number;

  @Column({ comment: 'secure', name: 'secure' })
  secure: string;

  @Column({ comment: '服务（默认服务列表中选择 自定义配置service需要配置host 和post）', name: 'service' })
  service: string;

  @Column({ comment: 'ignoreTLS', default: 0 })
  ignoreTLS: number;

  @Column({ comment: 'authUser' })
  authUser: string;

  @Column({ comment: 'authPass' })
  authPass: string;

  @Column({ default: 0, nullable: false, comment: '0: 关闭 1 启用' })
  status: number;

  @Column({ default: 0, nullable: false, comment: '1: 是 0 否' })
  isDefault: number;

  @Column({ default: 0, nullable: false, comment: '1: 是 0 否' })
  isDelete: number;

  @Column({ comment: '开始时间', type: "bigint" })
  creatTime: number;

  @Column({ comment: '更新时间', nullable: true, type: "bigint" })
  updateTime: number;

  @Column({ comment: '删除时间', nullable: true,  type: "bigint" })
  deleteTime: number;

}
