import { Repository } from 'typeorm';
import { UserAuth } from 'src/entities/auth/user-auth.entity';
import { AuthDataService } from './auth-data.service';
import { MainLoggerService } from 'src/utils/main-logger';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { mock } from 'jest-mock-extended';

describe('AuthDataService', () => {
  let service: AuthDataService;
  let mockRepo: Repository<UserAuth>;
  let mockLogger: MainLoggerService;

  beforeAll(() => {
    mockRepo = mock<Repository<UserAuth>>();
    mockLogger = mock<MainLoggerService>({
      log: jest.fn(),
      error: jest.fn(),
    });
    service = new AuthDataService(mockRepo, mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findUserByUsername', () => {
    it('should return a user if it exists', async () => {
      const testUser = new UserAuth();
      testUser.username = 'testuser';
      jest.spyOn(mockRepo, 'findOne').mockResolvedValueOnce(testUser);

      expect(await service.findUserByUsername('testuser')).toEqual(testUser);
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(mockRepo, 'findOne').mockResolvedValueOnce(null);

      expect(await service.findUserByUsername('testuser')).toBeNull();
    });
  });

  describe('#createUserAuth', () => {
    it('should successfully create a user', async () => {
      const testUser = new UserAuth();
      testUser.username = 'testuser';
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
        email: '',
        role: '',
      };
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedpass');
      jest.spyOn(mockRepo, 'save').mockResolvedValueOnce(testUser);

      const result = await service.createUserAuth(createUserDto);

      expect(result).toEqual(testUser);
    });
  });
});
