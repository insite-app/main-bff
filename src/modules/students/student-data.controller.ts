import { Controller, Get } from '@nestjs/common';
import { Student } from 'src/entities/students/student.entity';
import StudentDataService from 'src/modules/students/student-data.service';

@Controller('students')
export class StudentDataController {
  constructor(private readonly studentDataService: StudentDataService) {}

  @Get()
  async findAll(): Promise<Student[]> {
    return this.studentDataService.findAll();
  }
}
