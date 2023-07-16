import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionBlock } from 'src/entities/connections/connection-block.entity';
import { ConnectionRequest } from 'src/entities/connections/connection-request.entity';
import { Connection } from 'src/entities/connections/connection.entity';
import { RequestReject } from 'src/entities/connections/request-reject.entity';
import { Repository } from 'typeorm';
import { MainLoggerService } from 'src/utils/main-logger';
import { BlockUserDto } from './dto/block-user.dto';
import UserDataService from 'src/modules/users/user-data.service';

@Injectable()
export class ConnectionsService {
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

  async getAllConnectionsByUserId(userId: string): Promise<Connection[]> {
    try {
      return this.connectionRepository.find({
        where: [{ user1Id: userId }, { user2Id: userId }],
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeConnection(connectionId: string): Promise<void> {
    try {
      await this.connectionRepository.delete({ id: connectionId });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeConnectionByUserIds(
    user1Id: string,
    user2Id: string,
  ): Promise<void> {
    try {
      await this.connectionRepository.delete({
        user1Id,
        user2Id,
      });
      await this.connectionRepository.delete({
        user1Id: user2Id,
        user2Id: user1Id,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async blockUser(blockUserDto: BlockUserDto): Promise<void> {
    try {
      const { blockerId, blockedId } = blockUserDto;
      // Check if users exist
      const user1 = await this.userDataService.findById(blockerId);
      const user2 = await this.userDataService.findById(blockedId);
      if (!user1 || !user2) {
        throw new Error('User not found');
      }
      await this.removeConnectionByUserIds(blockerId, blockedId);
      await this.blockRepository.save(blockUserDto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
