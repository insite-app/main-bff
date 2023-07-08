import { Module } from '@nestjs/common';
import { StudentAuthService } from './student-auth.service';
import { AuthService } from '../auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { StudentAuthController } from './student-auth.controller';

@Module({
  providers: [StudentAuthService, AuthService, JwtService],
  controllers: [StudentAuthController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class StudentAuthModule {}
