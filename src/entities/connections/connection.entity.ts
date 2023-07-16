import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user1Id: string;

  @Column({ type: 'uuid' })
  user2Id: string;

  @CreateDateColumn()
  createdAt: Date;
}
