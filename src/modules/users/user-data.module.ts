import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataController } from './user-data.controller';
import { User } from '../../entities/users/user.entity';
import { UserAuth } from '../../entities/auth/user-auth.entity';
import { UserDataService } from './user-data.service';
import { MainLoggerService } from 'src/utils/main-logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserAuth]),
  ],
  controllers: [UserDataController],
  providers: [UserDataService, MainLoggerService],
})
export class UserDataModule {}
