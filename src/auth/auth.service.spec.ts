import { AuthService } from './auth.service';
import { AuthDataService } from './auth-data.service';
import { UserDataService } from './../modules/users/user-data.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserAuth } from 'src/entities/user-auth.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { MockProxy, mock } from 'jest-mock-extended';
import { MainLoggerService } from 'src/utils/main-logger';
import { HttpException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockAuthDataService: MockProxy<AuthDataService>;
  let mockUserDataService: MockProxy<UserDataService>;
  let mockJwtService: MockProxy<JwtService>;
  let mockLogger: MockProxy<MainLoggerService>;
  let testUserAuth: UserAuth;
  let testUser: User;
  let testCreateUserDto: CreateUserDto;

  beforeAll(() => {
    mockAuthDataService = mock<AuthDataService>();
    mockUserDataService = mock<UserDataService>();
    mockJwtService = mock<JwtService>();
    mockLogger = mock<MainLoggerService>();
    service = new AuthService(
      mockAuthDataService,
      mockUserDataService,
      mockJwtService,
      mockLogger,
    );
    testUserAuth = {
      password_hash: 'hashed_password',
      id: 'test_id',
      user: {
        username: 'test',
        role: 'test_role',
        id: 'test_id',
        email: 'test_email',
        name: 'test_name',
        created_at: new Date(),
        phone: 'test_phone',
        organization_name: 'test_organization_name',
        bio: 'test_bio',
        avatar: 'test_avatar',
        updated_at: new Date(),
        userAuth: null,
      },
      created_at: new Date(),
    };
    testUser = {
      username: 'test',
      role: 'test_role',
      id: 'test_id',
      email: 'test_email',
      name: 'test_name',
      created_at: new Date(),
      userAuth: null,
      phone: 'test_phone',
      organization_name: 'test_organization_name',
      bio: 'test_bio',
      avatar: 'test_avatar',
      updated_at: new Date(),
    };
    testCreateUserDto = {
      username: 'test',
      password: 'test_password',
      email: 'test_email',
      role: 'test_role',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#validate', () => {
    it('should validate user credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockAuthDataService.findUserByUsername.mockResolvedValue(testUserAuth);

      const result = await service.validate('test', 'test_password');

      expect(result).toBe(testUserAuth);
      expect(mockAuthDataService.findUserByUsername).toHaveBeenCalledWith(
        'test',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'test_password',
        'hashed_password',
      );
    });
  });
  describe('#login', () => {
    it('should log user in and return access token', async () => {
      const token = 'test_token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(testUserAuth);

      expect(result.accessToken).toBe(token);
      expect(result.refreshToken).toBe(token);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('#register', () => {
    it('should register user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test_password',
        email: 'test_email',
        role: 'test_role',
      };
      mockAuthDataService.findUserByUsername.mockResolvedValue(null);
      mockAuthDataService.createUserAuth.mockResolvedValue(testUserAuth);
      mockUserDataService.create.mockResolvedValue(testUser);

      const result = await service.register(createUserDto);

      expect(result.userAuth).toBe(testUserAuth);
      expect(result.userProfile).toBe(testUser);
    });

    it('should throw error if username already taken', async () => {
      mockAuthDataService.findUserByUsername.mockResolvedValue(new UserAuth());

      await expect(service.register(testCreateUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('#refresh', () => {
    it('should refresh user token', async () => {
      const user = { username: 'test', id: 'user_id' };
      const token = 'test_token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.refresh(user);

      expect(result.accessToken).toBe(token);
    });
  });

  describe('#getUser', () => {
    it('should return user info', async () => {
      const user = { username: 'test', id: 'user_id' };
      mockUserDataService.findById.mockResolvedValue(testUser);

      const result = await service.getUser(user);

      expect(result).toEqual({ ...user, ...testUser });
    });

    it('should log error if an error occurs while getting user info', async () => {
      const user = { username: 'test', id: 'user_id' };
      const error = new Error('Test error');
      mockUserDataService.findById.mockRejectedValue(error);

      try {
        await service.getUser(user);
      } catch (err) {
        expect(mockLogger.error).toHaveBeenCalledWith(error);
      }
    });
  });
});
