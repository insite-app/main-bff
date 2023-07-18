import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionRequestsService as RequestsService } from './connection-requests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getAllConnectionsByUserId(@Param('userId') userId: string) {
    return await this.connectionsService.getAllConnectionsByUserId(userId);
  }

  @Get('/exists/:user1Id/:user2Id')
  @UseGuards(JwtAuthGuard)
  async checkIfConnectionExists(
    @Param('user1Id') user1Id: string,
    @Param('user2Id') user2Id: string,
  ) {
    return await this.connectionsService.checkIfConnectionExists(
      user1Id,
      user2Id,
    );
  }

  @Post('delete/:user1Id/:user2Id')
  @UseGuards(JwtAuthGuard)
  async removeConnectionByUserIds(
    @Param('user1Id') user1Id: string,
    @Param('user2Id') user2Id: string,
  ) {
    return await this.connectionsService.removeConnectionByUserIds(
      user1Id,
      user2Id,
    );
  }
}
