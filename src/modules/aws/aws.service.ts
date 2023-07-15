import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MainLoggerService } from 'src/utils/main-logger';

@Injectable()
export class AwsService {
  constructor(
    private configService: ConfigService,
    private logger: MainLoggerService,
  ) {}

  private readonly s3Client = new S3Client({
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
    region: this.configService.getOrThrow('AWS_REGION'),
  });

  async uploadFile(fileName: string, fileContent: Buffer) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
          Key: fileName,
          Body: fileContent,
        }),
      );
      this.logger.log(`File ${fileName} uploaded successfully`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async generatePresignedUrl(fileName: string) {
    const getObjectParams = {
      Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
      Key: fileName,
    };

    try {
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return url;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
