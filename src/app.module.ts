import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { UserDataModule } from './modules/users/user-data.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [DatabaseModule, AuthModule, UserDataModule, ConfigModule.forRoot()],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
