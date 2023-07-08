import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentAuth } from 'src/entities/auth/student-auth.entity';
import { MainLoggerService } from 'src/utils/main-logger';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(StudentAuth)
    private readonly studentAuthRepository: Repository<StudentAuth>,
    private readonly logger: MainLoggerService,
  ) {}

  async findStudentByUsername(username: string): Promise<any> {
    try {
      return this.studentAuthRepository.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
