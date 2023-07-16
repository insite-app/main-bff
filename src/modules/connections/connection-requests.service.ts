import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionBlock } from 'src/entities/connections/connection-block.entity';
import { ConnectionRequest } from 'src/entities/connections/connection-request.entity';
import { Connection } from 'src/entities/connections/connection.entity';
import { RequestReject } from 'src/entities/connections/request-reject.entity';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { MainLoggerService } from 'src/utils/main-logger';
import UserDataService from 'src/modules/users/user-data.service';

@Injectable()
export class ConnectionRequestsService {
  constructor(
    @InjectRepository(RequestReject)
    private readonly requestRejectRepository: Repository<RequestReject>,
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    @InjectRepository(ConnectionRequest)
    private readonly requestRepository: Repository<ConnectionRequest>,
    @InjectRepository(ConnectionBlock)
    private readonly blockRepository: Repository<ConnectionBlock>,
    private readonly userDataService: UserDataService,
    private readonly logger: MainLoggerService,
  ) {}

  async requestConnection(
    createRequestDto: CreateRequestDto,
  ): Promise<ConnectionRequest> {
    const { senderId, receiverId } = createRequestDto;
    try {
      // Check if users exist
      const user1 = await this.userDataService.findById(senderId);
      const user2 = await this.userDataService.findById(receiverId);
      if (!user1 || !user2) {
        throw new Error('User not found');
      }
      // Check if a connection already exists
      const connection = await this.connectionRepository.findOne({
        where: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      });
      if (connection) {
        throw new Error('Connection already exists');
      }
      // Check if a request already exists
      const request = await this.requestRepository.findOne({
        where: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (request) {
        throw new Error('Request already exists');
      }
      // Check if a block exists
      const block = await this.blockRepository.findOne({
        where: [
          { blockerId: senderId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: senderId },
        ],
      });
      if (block) {
        throw new Error('Connection blocked');
      }
      // Check if request reject exists
      const requestReject = await this.requestRejectRepository.findOne({
        where: [{ senderId, receiverId }],
      });
      if (requestReject && requestReject.rejectedTimes >= 3) {
        throw new Error('Too many requests rejected');
      }
      // Create the request
      const newRequest = await this.requestRepository.save(createRequestDto);
      return newRequest;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async acceptRequest(requestId: string): Promise<Connection> {
    try {
      // Check if request exists
      const request = await this.requestRepository.findOne({
        where: { id: requestId },
      });
      if (!request) {
        throw new Error('Request not found');
      }
      // Check if a connection already exists
      const connection = await this.connectionRepository.findOne({
        where: [
          { user1Id: request.senderId, user2Id: request.receiverId },
          { user1Id: request.receiverId, user2Id: request.senderId },
        ],
      });
      if (connection) {
        throw new Error('Connection already exists');
      }
      // Create the connection
      const newConnection = await this.connectionRepository.save({
        user1Id: request.senderId,
        user2Id: request.receiverId,
      });
      // Delete the request
      await this.requestRepository.delete(requestId);
      return newConnection;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async rejectRequest(requestId: string): Promise<RequestReject> {
    try {
      // Check if request exists
      const request = await this.requestRepository.findOne({
        where: { id: requestId },
      });
      if (!request) {
        throw new Error('Request not found');
      }
      // Check if a connection already exists
      const connection = await this.connectionRepository.findOne({
        where: [
          { user1Id: request.senderId, user2Id: request.receiverId },
          { user1Id: request.receiverId, user2Id: request.senderId },
        ],
      });
      if (connection) {
        throw new Error('Connection already exists');
      }
      // Check if a request reject already exists
      const requestReject = await this.requestRejectRepository.findOne({
        where: [{ senderId: request.senderId, receiverId: request.receiverId }],
      });
      if (requestReject) {
        // Update the request reject
        requestReject.rejectedTimes += 1;
        await this.requestRejectRepository.save(requestReject);
        await this.requestRepository.delete(requestId);
        return requestReject;
      } else {
        // Create the request reject
        const newRequestReject = await this.requestRejectRepository.save({
          senderId: request.senderId,
          receiverId: request.receiverId,
          rejectedTimes: 1,
        });
        await this.requestRepository.delete(requestId);
        return newRequestReject;
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllReceivedRequestsByUserId(
    userId: string,
  ): Promise<ConnectionRequest[]> {
    try {
      return this.requestRepository.find({
        where: { receiverId: userId },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async checkIfRequestExists(
    senderId: string,
    receiverId: string,
  ): Promise<boolean> {
    try {
      const request = await this.requestRepository.findOne({
        where: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (request) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
