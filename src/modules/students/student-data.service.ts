import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/entities/students/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentDataService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findById(id: number): Promise<Student> {
    return this.studentRepository.findOne({ where: { id } });
  }

  async create(user: Student): Promise<Student> {
    return this.studentRepository.save(user);
  }

  async update(id: number, user: Partial<Student>): Promise<Student> {
    await this.studentRepository.update(id, user);
    return this.studentRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.studentRepository.delete(id);
  }
}

export default StudentDataService;
