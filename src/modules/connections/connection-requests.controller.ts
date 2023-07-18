import {
  Controller,
  Get,
  Param,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ConnectionRequestsService as RequestsService } from './connection-requests.service';
import UserDataService from '../users/user-data.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Controller('connections/requests')
export class ConnectionRequestsController {
  constructor(
    private requestsService: RequestsService,
    private userDataService: UserDataService,
  ) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getAllReceivedRequests(@Param('userId') userId: string) {
    return await this.requestsService.getAllReceivedRequestsByUserId(userId);
  }

  @Get('/requestId/:senderId/:receiverId')
  @UseGuards(JwtAuthGuard)
  async getRequestId(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return await this.requestsService.getRequestId(senderId, receiverId);
  }

  @Post('/create/:senderId/:receiverId')
  @UseGuards(JwtAuthGuard)
  async createRequest(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    if (receiverId === senderId) {
      throw new Error('Cannot request connection to self');
    }
    return await this.requestsService.requestConnection({
      senderId,
      receiverId,
    });
  }

  @Post(':requestId/accept')
  @UseGuards(JwtAuthGuard)
  async acceptRequest(@Param('requestId') requestId: string) {
    return await this.requestsService.acceptRequest(requestId);
  }

  @Post(':requestId/reject')
  @UseGuards(JwtAuthGuard)
  async rejectRequest(@Param('requestId') requestId: string) {
    return await this.requestsService.rejectRequest(requestId);
  }
}
