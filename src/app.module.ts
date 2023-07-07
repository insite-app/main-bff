import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { StudentModule } from './modules/students/student-data.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, StudentModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
