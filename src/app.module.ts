import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { UserDataModule } from './modules/users/user-data.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './modules/search/search.module';
import { ConnectionsModule } from './modules/connections/connections.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    SearchModule,
    UserDataModule,
    ConfigModule.forRoot(),
    ConnectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
