import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserAuth } from '../auth/user-auth.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @OneToOne(() => UserAuth, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  userAuth: UserAuth;

  @Column({ nullable: true })
  organization_name: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  readonly created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  readonly updated_at: Date;
}
