import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/entities/students/student.entity';
import { Repository } from 'typeorm';
import { MainLoggerService } from 'src/utils/main-logger';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentDataService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly logger: MainLoggerService,
  ) {}

  async findAll(): Promise<Student[]> {
    try {
      return this.studentRepository.find();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findById(id: string): Promise<Student> {
    try {
      return this.studentRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findByUsername(username: string): Promise<Student> {
    try {
      return this.studentRepository.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Implement the logic to save the student to your data store
    const newStudent = await this.studentRepository.create(createStudentDto);
    return await this.studentRepository.save(newStudent);
  }

  async update(id: string, user: Partial<Student>): Promise<Student> {
    try {
      await this.studentRepository.update(id, user);
      return this.studentRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.studentRepository.delete(id);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

export default StudentDataService;
