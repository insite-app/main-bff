import { Controller, Get, Post, Body } from '@nestjs/common';
import { Student } from 'src/entities/students/student.entity';
import StudentDataService from 'src/modules/students/student-data.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentDataController {
  constructor(private readonly studentDataService: StudentDataService) {}

  @Get()
  async findAll(): Promise<Student[]> {
    return this.studentDataService.findAll();
  }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    // Implement the logic to create a new student
    return this.studentDataService.create(createStudentDto);
  }
}
