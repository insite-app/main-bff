import { Repository } from 'typeorm';
import { UserAuth } from 'src/entities/user-auth.entity';
import { AuthDataService } from './auth-data.service';
import { MainLoggerService } from 'src/utils/main-logger';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity'; // Assuming User entity is defined
import { mock } from 'jest-mock-extended';

describe('AuthDataService', () => {
  let service: AuthDataService;
  let mockAuthRepo: Repository<UserAuth>;
  let mockLogger: MainLoggerService;

  beforeAll(() => {
    mockAuthRepo = mock<Repository<UserAuth>>();
    mockLogger = mock<MainLoggerService>({
      log: jest.fn(),
      error: jest.fn(),
    });
    service = new AuthDataService(mockAuthRepo, mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findUserByUsername', () => {
    it('should return a user if it exists', async () => {
      const testUserAuth = new UserAuth();
      testUserAuth.user = new User();
      testUserAuth.user.username = 'testuser';

      jest.spyOn(mockAuthRepo, 'createQueryBuilder').mockImplementation(
        () =>
          ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(testUserAuth),
          } as any),
      );

      expect(await service.findUserByUsername('testuser')).toEqual(
        testUserAuth,
      );
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(mockAuthRepo, 'createQueryBuilder').mockImplementation(
        () =>
          ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
          } as any),
      );

      expect(await service.findUserByUsername('testuser')).toBeNull();
    });
  });

  describe('#createUserAuth', () => {
    it('should successfully create a user', async () => {
      const testUserAuth = new UserAuth();
      testUserAuth.user = new User(); // Assuming User entity is defined
      testUserAuth.user.username = 'testuser';
      const createUserDto: CreateUserDto = {
        role: 'testrole',
        username: 'testuser',
        password: 'testpass',
        email: '',
      };
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedpass');
      jest.spyOn(mockAuthRepo, 'save').mockResolvedValueOnce(testUserAuth);

      const result = await service.createUserAuth(createUserDto);

      expect(result).toEqual(testUserAuth);
    });
  });
});
