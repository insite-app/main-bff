import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentDataController } from './student-data.controller';
import { Student } from '../../entities/students/student.entity';
import { StudentDataService } from './student-data.service';
import { MainLoggerService } from 'src/utils/main-logger';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentDataController],
  providers: [StudentDataService, MainLoggerService],
})
export class StudentModule {}
