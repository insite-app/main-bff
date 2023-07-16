import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @Column({ type: 'uuid' })
  user1Id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @Column({ type: 'uuid' })
  user2Id: string;

  @CreateDateColumn()
  createdAt: Date;
}
