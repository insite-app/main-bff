import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentDataController } from './student-data.controller';
import { Student } from '../../entities/students/student.entity';
import { StudentDataService } from './student-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentDataController],
  providers: [StudentDataService],
})
export class StudentModule {}
