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
    @InjectRepository(ConnectionBlock)
    private readonly blockRepository: Repository<ConnectionBlock>,
    private readonly userDataService: UserDataService,
    private readonly logger: MainLoggerService,
  ) {}

  async getAllConnectionsByUserId(userId: string): Promise<any[]> {
    try {
      const connections = await this.connectionRepository
        .createQueryBuilder('connection')
        .leftJoinAndSelect('connection.user1', 'user1')
        .leftJoinAndSelect('connection.user2', 'user2')
        .where('connection.user1Id = :userId', { userId })
        .orWhere('connection.user2Id = :userId', { userId })
        .getMany();

      return connections.map((connection) => {
        let currentUser, otherUser;
        if (connection.user1Id === userId) {
          currentUser = connection.user1;
          otherUser = connection.user2;
        } else {
          currentUser = connection.user2;
          otherUser = connection.user1;
        }

        const { user1, user2, ...rest } = connection;
        return {
          ...rest,
          currentUser: currentUser,
          otherUser: otherUser,
        };
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

  async unblockUser(blockUserDto: BlockUserDto): Promise<void> {
    try {
      const { blockerId, blockedId } = blockUserDto;
      // Check if users exist
      const user1 = await this.userDataService.findById(blockerId);
      const user2 = await this.userDataService.findById(blockedId);
      if (!user1 || !user2) {
        throw new Error('User not found');
      }
      await this.blockRepository.delete(blockUserDto);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async checkIfConnectionExists(
    user1Id: string,
    user2Id: string,
  ): Promise<boolean> {
    try {
      const connection = await this.connectionRepository.findOne({
        where: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      });
      return !!connection;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
