import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataController } from './user-data.controller';
import { User } from '../../entities/users/user.entity';
import { UserAuth } from '../../entities/auth/user-auth.entity';
import { UserDataService } from './user-data.service';
import { MainLoggerService } from 'src/utils/main-logger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AwsService } from '../aws/aws.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserAuth]),
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.getOrThrow('THROTTLE_TTL'),
        limit: configService.getOrThrow('THROTTLE_LIMIT'),
      }),
    }),
  ],
  controllers: [UserDataController],
  providers: [
    UserDataService,
    MainLoggerService,
    AwsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class UserDataModule {}
