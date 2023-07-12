import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDataService } from './auth-data.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserDataService } from 'src/modules/users/user-data.service';
import { MainLoggerService } from 'src/utils/main-logger';
import { UserAuth } from 'src/entities/auth/user-auth.entity';
import { User } from 'src/entities/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataModule } from 'src/modules/users/user-data.module';
import { JwtStrategy } from './strategies/jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local-strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([UserAuth]),
    TypeOrmModule.forFeature([User]),
    UserDataModule,
  ],
  providers: [
    AuthService,
    AuthDataService,
    UserDataService,
    MainLoggerService,
    JwtStrategy,
    LocalStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
