import { UserDataService } from './user-data.service';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserAuth } from 'src/entities/user-auth.entity';
import { MainLoggerService } from 'src/utils/main-logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { MockProxy, mock } from 'jest-mock-extended';

describe('UserDataService', () => {
  let service: UserDataService;
  let mockUserRepository: MockProxy<Repository<User>>;
  let mockUserAuthRepository: MockProxy<Repository<UserAuth>>;
  let mockLogger: MockProxy<MainLoggerService>;

  beforeAll(async () => {
    mockUserRepository = mock<Repository<User>>({
      createQueryBuilder: jest.fn(),
    });
    mockUserAuthRepository = mock<Repository<UserAuth>>();
    mockLogger = mock<MainLoggerService>({
      error: jest.fn(),
      log: jest.fn(),
    });
    service = new UserDataService(
      mockUserRepository,
      mockUserAuthRepository,
      mockLogger,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('#findAll', () => {
    it('should return all users', async () => {
      const userArray: User[] = [new User(), new User()];
      mockUserRepository.find.mockResolvedValue(userArray);

      const result = await service.findAll();

      expect(result).toBe(userArray);
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should log an error if one occurs', async () => {
      mockUserRepository.find.mockRejectedValue(new Error('test error'));

      try {
        await service.findAll();
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
  describe('#findUserRoleById', () => {
    it('should return a user role', async () => {
      const userAuth = new UserAuth();
      userAuth.role = 'test_role';
      mockUserAuthRepository.findOne.mockResolvedValue(userAuth);

      const result = await service.findUserRoleById('test_id');

      expect(result).toBe('test_role');
      expect(mockUserAuthRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should log an error if one occurs', async () => {
      mockUserAuthRepository.findOne.mockRejectedValue(new Error('test error'));

      try {
        await service.findUserRoleById('test_id');
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
  describe('#findById', () => {
    it('should return a user', async () => {
      const user = new User();
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findById('test_id');

      expect(result).toBe(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should log an error if one occurs', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('test error'));

      try {
        await service.findById('test_id');
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
  describe('#create', () => {
    it('should create a user', async () => {
      const user = new User();
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(new CreateUserDto());

      expect(result).toBe(user);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should log an error if one occurs', async () => {
      mockUserRepository.save.mockRejectedValue(new Error('test error'));

      try {
        await service.create(new CreateUserDto());
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
  describe('#update', () => {
    it('should update a user', async () => {
      const user = new User();
      mockUserRepository.save.mockResolvedValue(user);
      mockUserRepository.findOne.mockResolvedValue(null);
      service.findById = jest.fn().mockResolvedValue(user);

      const result = await service.update('test_id', new UpdateUserDto());

      expect(result).toBe(user);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should log an error if one occurs', async () => {
      mockUserRepository.save.mockRejectedValue(new Error('test error'));

      try {
        await service.update('test_id', new UpdateUserDto());
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
  describe('#saveAvatar', () => {
    it('should update a user avatar', async () => {
      const user = new User();
      mockUserRepository.save.mockResolvedValue(user);
      mockUserRepository.findOne.mockResolvedValue(null);
      service.findById = jest.fn().mockResolvedValue(user);

      const result = await service.saveAvatar('test_id', new UpdateAvatarDto());

      expect(result).toBe(user);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should log an error if one occurs', async () => {
      mockUserRepository.save.mockRejectedValue(new Error('test error'));

      try {
        await service.saveAvatar('test_id', new UpdateAvatarDto());
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
  describe('#delete', () => {
    it('should delete a user', async () => {
      mockUserRepository.delete.mockResolvedValue(null);

      const result = await service.delete('test_id');

      expect(result).toBe(undefined);
      expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
    });
    it('should log an error if one occurs', async () => {
      mockUserRepository.delete.mockRejectedValue(new Error('test error'));

      try {
        await service.delete('test_id');
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});
