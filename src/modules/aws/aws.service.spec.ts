import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MockProxy, mock } from 'jest-mock-extended';
import { MainLoggerService } from 'src/utils/main-logger';

const mockS3ClientSend = jest.fn();
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: mockS3ClientSend,
    })),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('AwsService', () => {
  let service: AwsService;
  let mockConfigService: MockProxy<ConfigService>;
  let mockLogger: MockProxy<MainLoggerService>;

  beforeAll(() => {
    mockConfigService = mock<ConfigService>({
      getOrThrow: jest.fn().mockReturnValue('test'),
    });
    mockLogger = mock<MainLoggerService>({
      log: jest.fn(),
      error: jest.fn(),
    });
    service = new AwsService(mockConfigService, mockLogger);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('#uploadFile', () => {
    it('should upload file', async () => {
      await service.uploadFile('test', Buffer.from('test file'));

      expect(mockS3ClientSend).toHaveBeenCalledWith(
        new PutObjectCommand({
          Bucket: 'test',
          Key: 'test',
          Body: Buffer.from('test file'),
        }),
      );
      expect(mockLogger.log).toHaveBeenCalledTimes(1);
    });
  });
  describe('#generatePresignedUrl', () => {
    it('should generate presigned url', async () => {
      await service.generatePresignedUrl('test');
      expect(getSignedUrl).toHaveBeenCalledWith(
        { send: mockS3ClientSend },
        new GetObjectCommand({
          Bucket: 'test',
          Key: 'test',
        }),
        { expiresIn: 3600 },
      );
    });
  });
});
