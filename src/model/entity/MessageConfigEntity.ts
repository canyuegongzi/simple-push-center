import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'message_config'})
export class MessageConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0, nullable: false, comment: '0: 关闭 1 启用', name: 'status' })
  status: number;

  @Column({ nullable: false, comment: 'sdk签名', name: 'signName' })
  signName: string;

  @Column({ length: 500, nullable: false, comment: '操作人员' })
  operateUser: string;

  @Column({ nullable: false, comment: '名称', name: 'name' })
  name: string;

  @Column({ nullable: false, comment: '模板', name: 'templateCode' })
  templateCode: string;

  @Column({ nullable: false, comment: 'accessKeyId', name: 'accessKeyId' })
  accessKeyId: string;

  @Column({ nullable: false, comment: 'secretAccessKey', name: 'secretAccessKey' })
  secretAccessKey: string;

  @Column({ default: 0, nullable: false, comment: '1: 是 0 否' })
  isDefault: number;

  @Column({ default: '暂无说明', nullable: false, comment: '推送数据参数说明' })
  paramsNote: string

  @Column({ comment: '开始时间', type: "bigint" })
  creatTime: number;

  @Column({ comment: '更新时间', nullable: true,  type: "bigint" })
  updateTime: number;

  @Column({ comment: '删除时间', nullable: true,  type: "bigint" })
  deleteTime: number;

  @Column({ default: 0, nullable: false, comment: '1: 是 0 否' })
  isDelete: number;

}
