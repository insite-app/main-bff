import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { StudentModule } from './modules/students/student-data.module';
import { ConfigModule } from '@nestjs/config';
import { StudentAuthModule } from './auth/student-auth/student-auth.module';
import { AuthService } from './auth/auth.service';
import { StudentAuthController } from './auth/student-auth/student-auth.controller';

@Module({
  imports: [
    DatabaseModule,
    StudentModule,
    ConfigModule.forRoot(),
    StudentAuthModule,
  ],
  controllers: [AppController, StudentAuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
