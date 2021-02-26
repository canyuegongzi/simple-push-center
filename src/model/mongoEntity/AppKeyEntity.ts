import {
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity({name: 'app_key'})
export class AppKeyEntity {
  @ObjectIdColumn()
  id: ObjectID;

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

  @Column({ comment: '开始时间' })
  creatTime?: number;
  
  @Column({ comment: '开始时间' })
  secret: string;

}
