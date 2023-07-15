import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/entities/user.entity';

@Entity('users_auth')
export class UserAuth {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @OneToOne(() => User, (user) => user.userAuth, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ nullable: false })
  role: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password_hash: string;

  @CreateDateColumn()
  readonly created_at: Date;
}
