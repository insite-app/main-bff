import { Module } from '@nestjs/common';
import { ConnectionsController } from './connections.controller';
import { ConnectionRequestsController } from './connection-requests.controller';
import { ConnectionsService } from './connections.service';
import { ConnectionRequestsService } from './connection-requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'src/entities/connections/connection.entity';
import { ConnectionRequest } from 'src/entities/connections/connection-request.entity';
import { ConnectionBlock } from 'src/entities/connections/connection-block.entity';
import { RequestReject } from 'src/entities/connections/request-reject.entity';
import { MainLoggerService } from 'src/utils/main-logger';
import UserDataService from '../users/user-data.service';
import { UserAuth } from 'src/entities/user-auth.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connection]),
    TypeOrmModule.forFeature([ConnectionRequest]),
    TypeOrmModule.forFeature([ConnectionBlock]),
    TypeOrmModule.forFeature([RequestReject]),
    TypeOrmModule.forFeature([UserAuth]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ConnectionsController, ConnectionRequestsController],
  providers: [
    ConnectionsService,
    ConnectionRequestsService,
    MainLoggerService,
    UserDataService,
  ],
})
export class ConnectionsModule {}
