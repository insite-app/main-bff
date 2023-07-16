import { ConnectionRequestsService as RequestsService } from './connection-requests.service';
import { Repository } from 'typeorm';
import { RequestReject } from 'src/entities/connections/request-reject.entity';
import { MockProxy, mock } from 'jest-mock-extended';
import { Connection } from 'src/entities/connections/connection.entity';
import { ConnectionRequest } from 'src/entities/connections/connection-request.entity';
import { ConnectionBlock } from 'src/entities/connections/connection-block.entity';
import UserDataService from '../users/user-data.service';
import { MainLoggerService } from 'src/utils/main-logger';
import { User } from 'src/entities/user.entity';

describe('RequestsService', () => {
  let service: RequestsService;
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
    service = new RequestsService(
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

  describe('#requestConnection', () => {
    it('should request a connection', async () => {
      const createRequestDto = {
        senderId: 'test_sender_id',
        receiverId: 'test_receiver_id',
      };
      const user1 = new User();
      const user2 = new User();
      mockUserDataService.findById.mockResolvedValueOnce(user1);
      mockUserDataService.findById.mockResolvedValueOnce(user2);

      await service.requestConnection(createRequestDto);

      expect(mockUserDataService.findById).toBeCalledTimes(2);
      expect(mockConnectionRepository.findOne).toBeCalledTimes(1);
      expect(mockRequestRepository.findOne).toBeCalledTimes(1);
      expect(mockBlockRepository.findOne).toBeCalledTimes(1);
      expect(mockRequestRepository.save).toBeCalledTimes(1);
    });
    it('should throw an error if a user does not exist', async () => {
      const createRequestDto = {
        senderId: 'test_sender_id',
        receiverId: 'test_receiver_id',
      };
      mockUserDataService.findById.mockResolvedValueOnce(undefined);

      try {
        await service.requestConnection(createRequestDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
    it('should throw an error if a connection already exists', async () => {
      const createRequestDto = {
        senderId: 'test_sender_id',
        receiverId: 'test_receiver_id',
      };
      const user1 = new User();
      const user2 = new User();
      const connection = new Connection();
      mockUserDataService.findById.mockResolvedValueOnce(user1);
      mockUserDataService.findById.mockResolvedValueOnce(user2);
      mockConnectionRepository.findOne.mockResolvedValueOnce(connection);

      try {
        await service.requestConnection(createRequestDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
    it('should throw an error if a request already exists', async () => {
      const createRequestDto = {
        senderId: 'test_sender_id',
        receiverId: 'test_receiver_id',
      };
      const user1 = new User();
      const user2 = new User();
      const request = new ConnectionRequest();
      mockUserDataService.findById.mockResolvedValueOnce(user1);
      mockUserDataService.findById.mockResolvedValueOnce(user2);
      mockRequestRepository.findOne.mockResolvedValueOnce(request);

      try {
        await service.requestConnection(createRequestDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
    it('should throw an error if a block exists', async () => {
      const createRequestDto = {
        senderId: 'test_sender_id',
        receiverId: 'test_receiver_id',
      };
      const user1 = new User();
      const user2 = new User();
      const block = new ConnectionBlock();
      mockUserDataService.findById.mockResolvedValueOnce(user1);
      mockUserDataService.findById.mockResolvedValueOnce(user2);
      mockBlockRepository.findOne.mockResolvedValueOnce(block);

      try {
        await service.requestConnection(createRequestDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe('#acceptRequest', () => {
    it('should accept a request', async () => {
      const connectionRequest = new ConnectionRequest();
      connectionRequest.senderId = 'test_sender_id';
      connectionRequest.receiverId = 'test_receiver_id';
      mockRequestRepository.findOne.mockResolvedValue(connectionRequest);

      await service.acceptRequest('test_request_id');

      expect(mockRequestRepository.findOne).toBeCalledTimes(1);
      expect(mockConnectionRepository.save).toBeCalledTimes(1);
      expect(mockRequestRepository.delete).toBeCalledTimes(1);
    });
    it('should throw an error if the request does not exist', async () => {
      mockRequestRepository.findOne.mockResolvedValue(undefined);

      try {
        await service.acceptRequest('test_request_id');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe('#rejectRequest', () => {
    it('should reject a request', async () => {
      const connectionRequest = new ConnectionRequest();
      connectionRequest.senderId = 'test_sender_id';
      connectionRequest.receiverId = 'test_receiver_id';
      mockRequestRepository.findOne.mockResolvedValue(connectionRequest);

      await service.rejectRequest('test_request_id');

      expect(mockRequestRepository.findOne).toBeCalledTimes(1);
      expect(mockRequestRejectRepository.save).toBeCalledTimes(1);
      expect(mockRequestRepository.delete).toBeCalledTimes(1);
    });
    it('should throw an error if the request does not exist', async () => {
      mockRequestRepository.findOne.mockResolvedValue(undefined);

      try {
        await service.rejectRequest('test_request_id');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});
