import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('students_auth')
export class StudentAuth {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  username: string;

  @Column()
  password_hash: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
