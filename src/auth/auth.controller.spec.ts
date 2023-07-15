import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // This is a mock user to simulate a user logging in or registering
  const mockUser = { username: 'user1', password: 'password' };

  // This is a mock request object that simulates a user sending a request
  const mockRequest = { user: mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue('login success'),
            register: jest.fn().mockResolvedValue('register success'),
            refresh: jest.fn().mockResolvedValue('refresh success'),
            getUser: jest.fn().mockResolvedValue('get user success'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call login method', async () => {
    expect(await controller.login(mockRequest)).toBe('login success');
    expect(authService.login).toHaveBeenCalledWith(mockUser);
  });

  it('should call register method', async () => {
    const mockUserDto = {
      ...mockUser,
      email: 'mock@gmail.com',
      role: 'mockRole',
    };
    expect(await controller.register(mockUserDto)).toBe('register success');
    expect(authService.register).toHaveBeenCalledWith(mockUserDto);
  });

  it('should call refreshToken method', async () => {
    expect(await controller.refreshToken(mockRequest)).toBe('refresh success');
    expect(authService.refresh).toHaveBeenCalledWith(mockUser);
  });

  it('should call getUser method', async () => {
    expect(await controller.getUser(mockRequest)).toBe('get user success');
    expect(authService.getUser).toHaveBeenCalledWith(mockUser);
  });
});
