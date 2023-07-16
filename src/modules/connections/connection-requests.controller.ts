import { Controller, Get, Param, Post } from '@nestjs/common';
import { ConnectionRequestsService as RequestsService } from './connection-requests.service';
import UserDataService from '../users/user-data.service';

@Controller('connections/requests')
export class ConnectionRequestsController {
  constructor(
    private requestsService: RequestsService,
    private userDataService: UserDataService,
  ) {}

  @Get(':userId')
  async getAllReceivedRequests(@Param('userId') userId: string) {
    return await this.requestsService.getAllReceivedRequestsByUserId(userId);
  }

  @Get(':senderId/:receiverUsername/exists')
  async checkIfRequestExists(
    @Param('senderId') senderId: string,
    @Param('receiverUsername') receiverUsername: string,
  ) {
    const receiverId = await this.userDataService.getIdByUsername(
      receiverUsername,
    );
    return await this.requestsService.checkIfRequestExists(
      senderId,
      receiverId,
    );
  }

  @Post(':senderId/:receiverUsername')
  async createRequest(
    @Param('senderId') senderId: string,
    @Param('receiverUsername') receiverUsername: string,
  ) {
    const receiverId = await this.userDataService.getIdByUsername(
      receiverUsername,
    );
    if (receiverId === senderId) {
      throw new Error('Cannot request connection to self');
    }
    return await this.requestsService.requestConnection({
      senderId,
      receiverId,
    });
  }

  @Post(':requestId/accept')
  async acceptRequest(@Param('requestId') requestId: string) {
    return await this.requestsService.acceptRequest(requestId);
  }

  @Post(':requestId/reject')
  async rejectRequest(@Param('requestId') requestId: string) {
    return await this.requestsService.rejectRequest(requestId);
  }
}
