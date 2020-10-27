import {Entity, Column, PrimaryGeneratedColumn, Double, ObjectIdColumn} from 'typeorm';

@Entity({name: 'friend_message'})
export class FriendMessageEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  friendId: string;

  @Column()
  content: string;

  @Column()
  messageType: string;

  @Column('double')
  time: number;

  @Column()
  hashId: string;
}
