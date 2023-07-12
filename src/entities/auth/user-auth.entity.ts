import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from 'src/entities/users/user.entity';

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

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  readonly created_at: Date;
}
