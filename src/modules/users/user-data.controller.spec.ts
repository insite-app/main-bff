import { Test, TestingModule } from '@nestjs/testing';
import { UserDataController } from './user-data.controller';
import { UserDataService } from './user-data.service';
import { AwsService } from '../aws/aws.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as stream from 'stream';

const mockResize = jest.fn();
const mockToBuffer = jest.fn();

jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: mockResize.mockReturnThis(),
    toBuffer: mockToBuffer,
  }));
});

jest.mock('crypto', () => {
  const originalCrypto = jest.requireActual('crypto');
  return {
    ...originalCrypto,
    randomBytes: jest
      .fn()
      .mockImplementation(() => Buffer.from('1234567890abcdef')),
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockRandomBytes = require('crypto').randomBytes;

describe('UserDataController', () => {
  let controller: UserDataController;
  let mockUserDataService: MockProxy<UserDataService>;
  let mockAwsService: MockProxy<AwsService>;
  let createUserDto: CreateUserDto;
  let expectedUser: User;

  beforeEach(async () => {
    mockUserDataService = mock<UserDataService>();
    mockAwsService = mock<AwsService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDataController],
      providers: [
        { provide: UserDataService, useValue: mockUserDataService },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile();
    createUserDto = {
      username: 'test-user',
      email: 'test-email',
      role: 'test-role',
      password: 'test-password',
    };
    expectedUser = {
      id: expect.any(String),
      email: createUserDto.email,
      userAuth: expect.any(Object),
      organization_name: expect.any(String),
      phone: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      avatar: expect.any(String),
      name: expect.any(String),
      bio: expect.any(String),
    };
    controller = module.get<UserDataController>(UserDataController);
  });

  describe('#create', () => {
    it('should call UserDataService.create with the correct parameters', async () => {
      mockUserDataService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);

      expect(mockUserDataService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe(expectedUser);
    });
  });

  describe('#update', () => {
    it('should call UserDataService.update with the correct parameters', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'test-email',
        organization_name: 'Test Organization',
        phone: '1234567890',
        name: 'Test User',
        bio: 'Test Bio',
      };
      const expectedUpdatedUser: User = {
        id: expect.any(String),
        email: 'test-email',
        userAuth: expect.any(Object),
        organization_name: 'Test Organization',
        phone: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        avatar: expect.any(String),
        name: 'Test User',
        bio: 'Test Bio',
      };
      const username = 'test-user';
      const req = { user: { username, id: 'user-id' } };

      mockUserDataService.update.mockResolvedValue(expectedUpdatedUser);

      const result = await controller.update(username, updateUserDto, req);

      expect(mockUserDataService.update).toHaveBeenCalledWith(
        req.user.id,
        updateUserDto,
      );
      expect(result).toBe(expectedUpdatedUser);
    });

    it('should throw UnauthorizedException if the username does not match the user', async () => {
      const req = { user: { username: 'other-user', id: 'user-id' } };
      const username = 'test-user';
      const updateUserDto: UpdateUserDto = {
        email: 'test-email',
        organization_name: 'Test Organization',
        phone: '1234567890',
        name: 'Test User',
        bio: 'Test Bio',
      };

      await expect(
        controller.update(username, updateUserDto, req),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('#findAll', () => {
    it('should call UserDataService.findAllIncludingUsername and return the result', async () => {
      const expectedUsers: User[] = [
        /* populate with test data */
      ];

      mockUserDataService.findAllIncludingUsername.mockResolvedValue(
        expectedUsers,
      );

      const result = await controller.findAll();

      expect(
        mockUserDataService.findAllIncludingUsername,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedUsers);
    });
  });

  describe('#findByUsername', () => {
    it('should call UserDataService.findByUsername with the correct parameters and return the result', async () => {
      const username = 'test-user';

      mockUserDataService.findByUsername.mockResolvedValue(expectedUser);

      const result = await controller.findByUsername(username);

      expect(mockUserDataService.findByUsername).toHaveBeenCalledWith(username);
      expect(result).toBe(expectedUser);
    });
  });

  describe('#getAvatarByUsername', () => {
    it('should call UserDataService.getAvatarByUsername and AwsService.generatePresignedUrl with the correct parameters and return the result', async () => {
      const expectedUrl = 'https://presigned.url';
      const username = 'test-user';
      const avatar = 'test-avatar';

      mockUserDataService.getAvatarByUsername.mockResolvedValue(avatar);
      mockAwsService.generatePresignedUrl.mockResolvedValue(expectedUrl);

      const result = await controller.getAvatarByUsername(username);

      expect(mockUserDataService.getAvatarByUsername).toHaveBeenCalledWith(
        username,
      );
      expect(mockAwsService.generatePresignedUrl).toHaveBeenCalledWith(avatar);
      expect(result).toBe(expectedUrl);
    });
  });

  describe('#uploadAvatar', () => {
    it('should call AwsService.uploadFile and UserDataService.saveAvatar', async () => {
      const username = 'test-user';
      const req = { user: { username, id: 'user-id' } };
      const file = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('This is a test file', 'utf8'),
        size: 1024,
        destination: './uploads/', // Dummy destination
        filename: 'testFile.jpeg', // Dummy filename
        path: './uploads/testFile.jpeg', // Dummy path
        stream: new stream.PassThrough(),
      };
      const buffer = Buffer.from('This is a test buffer', 'utf8');
      const fileName = 'random-file-name';

      mockRandomBytes.mockReturnValue(Buffer.from(fileName, 'hex'));
      mockToBuffer.mockResolvedValue(buffer);

      await controller.uploadAvatar(username, req, file);

      expect(mockResize).toHaveBeenCalledWith({
        height: 1920,
        width: 1080,
        fit: 'contain',
      });
      expect(mockToBuffer).toHaveBeenCalled();
      expect(mockRandomBytes).toHaveBeenCalledWith(32);
      expect(mockAwsService.uploadFile).toHaveBeenCalledTimes(1);
      expect(mockUserDataService.saveAvatar).toHaveBeenCalledWith(req.user.id, {
        avatar: expect.any(String),
      });
    });

    it('should throw UnauthorizedException if the username does not match the user', async () => {
      const username = 'test-user';
      const req = { user: { username: 'other-user', id: 'user-id' } };
      const file = null;

      await expect(
        controller.uploadAvatar(username, req, file),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
