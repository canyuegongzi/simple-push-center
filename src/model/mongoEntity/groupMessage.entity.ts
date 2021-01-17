import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, ObjectIdColumn} from 'typeorm';

@Entity({name: 'group_message'})
export class GroupMessageEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  groupId: string;

  @Column()
  content: string;

  @Column()
  messageType: string;

  @Column('double')
  time: number;

  @Column()
  hashId: string;

  @Column({default: '0'})
  status: string;
}
