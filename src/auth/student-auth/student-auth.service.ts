import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { StudentDataService } from '../../modules/students/student-data.service';
import { Student } from 'src/entities/students/student.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StudentAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly studentDataService: StudentDataService,
    private jwtService: JwtService,
  ) {}

  async validateStudent(username: string, password: string): Promise<Student> {
    const studentAuth = await this.authService.findStudentByUsername(username);
    if (
      studentAuth &&
      (await bcrypt.compare(password, studentAuth.password_hash))
    ) {
      const { id } = studentAuth;
      const result = await this.studentDataService.findById(id);
      return result;
    }
    return null;
  }

  async login(student: Student) {
    const payload = {
      username: student.username,
      sub: {
        id: student.id,
        name: student.name,
      },
    };
    return {
      ...student,
      access_token: this.jwtService.sign(payload),
    };
  }
}
