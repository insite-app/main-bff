import { Controller, Get, Param } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionRequestsService as RequestsService } from './connection-requests.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}

  @Get(':userId')
  async getAllConnectionsByUserId(@Param('userId') userId: string) {
    return await this.connectionsService.getAllConnectionsByUserId(userId);
  }
}
