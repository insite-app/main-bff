import { ConnectionsService } from './connections.service';
import { Repository } from 'typeorm';
import { RequestReject } from 'src/entities/connections/request-reject.entity';
import { MockProxy, mock } from 'jest-mock-extended';
import { Connection } from 'src/entities/connections/connection.entity';
import { ConnectionRequest } from 'src/entities/connections/connection-request.entity';
import { ConnectionBlock } from 'src/entities/connections/connection-block.entity';
import UserDataService from '../users/user-data.service';
import { MainLoggerService } from 'src/utils/main-logger';
import { User } from 'src/entities/user.entity';

describe('ConnectionsService', () => {
  let service: ConnectionsService;
  let mockRequestRejectRepository: MockProxy<Repository<RequestReject>>;
  let mockConnectionRepository: MockProxy<Repository<Connection>>;
  let mockRequestRepository: MockProxy<Repository<ConnectionRequest>>;
  let mockBlockRepository: MockProxy<Repository<ConnectionBlock>>;
  let mockUserDataService: MockProxy<UserDataService>;
  let mockLogger: MockProxy<MainLoggerService>;

  beforeAll(async () => {
    mockRequestRejectRepository = mock<Repository<RequestReject>>();
    mockConnectionRepository = mock<Repository<Connection>>();
    mockRequestRepository = mock<Repository<ConnectionRequest>>();
    mockBlockRepository = mock<Repository<ConnectionBlock>>();
    mockUserDataService = mock<UserDataService>();
    mockLogger = mock<MainLoggerService>();
    service = new ConnectionsService(
      mockRequestRejectRepository,
      mockConnectionRepository,
      mockRequestRepository,
      mockBlockRepository,
      mockUserDataService,
      mockLogger,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#getAllConnectionsByUserId', () => {
    it('should get all connections by user id', async () => {
      mockConnectionRepository.find.mockResolvedValueOnce([new Connection()]);

      await service.getAllConnectionsByUserId('test_user_id');

      expect(mockConnectionRepository.find).toBeCalledWith({
        where: [{ user1Id: 'test_user_id' }, { user2Id: 'test_user_id' }],
      });
    });
  });

  describe('#removeConnection', () => {
    it('should remove a connection', async () => {
      await service.removeConnection('test_connection_id');

      expect(mockConnectionRepository.delete).toBeCalledWith({
        id: 'test_connection_id',
      });
    });
  });

  describe('#removeConnectionByUserIds', () => {
    it('should remove a connection by user ids', async () => {
      await service.removeConnectionByUserIds('test_user1_id', 'test_user2_id');

      expect(mockConnectionRepository.delete).toBeCalledTimes(2);
    });
  });

  describe('#blockUser', () => {
    it('should block a user', async () => {
      const blockUserDto = {
        blockedId: 'test_user1_id',
        blockerId: 'test_user2_id',
      };
      const user1 = new User();
      const user2 = new User();
      mockUserDataService.findById.mockResolvedValueOnce(user1);
      mockUserDataService.findById.mockResolvedValueOnce(user2);

      await service.blockUser(blockUserDto);

      expect(mockUserDataService.findById).toBeCalledTimes(2);
      expect(mockBlockRepository.save).toBeCalledWith({
        blockedId: 'test_user1_id',
        blockerId: 'test_user2_id',
      });
    });
  });
});
