import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity('connection_blocks')
export class ConnectionBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blockerId' })
  blocker: User;

  @Column({ type: 'uuid' })
  blockerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blockedId' })
  blocked: User;

  @Column({ type: 'uuid' })
  blockedId: string;

  @CreateDateColumn()
  createdAt: Date;
}
