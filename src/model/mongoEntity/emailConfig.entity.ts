import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity({name: 'email_config'})
export class EmailConfigEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ comment: 'host', name: 'name' })
  name: string;

  @Column({ length: 500, nullable: false, comment: '操作人员' })
  operateUser: string;

  @Column({ comment: 'host', name: 'host' })
  host: string;

  @Column({ comment: 'port', name: 'port' })
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

}
