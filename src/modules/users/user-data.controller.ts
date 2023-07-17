import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserDataService } from 'src/modules/users/user-data.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp';
import * as crypto from 'crypto';
import { AwsService } from '../aws/aws.service';

function countNewlines(str) {
  return (str.match(/\n/g) || []).length;
}

@Controller('users')
export class UserDataController {
  constructor(
    private readonly userDataService: UserDataService,
    private readonly awsService: AwsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async findAll(): Promise<User[]> {
    return this.userDataService.findAll();
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['student', 'admin', 'professional'])
  async findByUsername(@Param('username') username: string): Promise<User> {
    return this.userDataService.findByUsername(username);
  }

  @Get(':username/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['student', 'admin', 'professional'])
  async getAvatarByUsername(
    @Param('username') username: string,
  ): Promise<string> {
    const avatar = await this.userDataService.getAvatarByUsername(username);
    return this.awsService.generatePresignedUrl(avatar);
  }

  @Post(':username/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('username') username: string,
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const user = req.user;
    if (user.username !== username) {
      throw new UnauthorizedException(
        "You aren't authorized to update this user",
      );
    }
    const buffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: 'contain' })
      .toBuffer();
    const fileName = crypto.randomBytes(32).toString('hex');
    const currentAvatar = await this.userDataService.getAvatarById(user.id);
    if (currentAvatar && currentAvatar !== 'defaultpic.jpeg') {
      await this.awsService.deleteFile(currentAvatar);
    }
    await this.awsService.uploadFile(fileName, buffer);
    await this.userDataService.saveAvatar(user.id, { avatar: fileName });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userDataService.create(createUserDto);
  }

  @Put(':username')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<any> {
    const user = req.user;
    if (user.username !== username) {
      throw new UnauthorizedException(
        "You aren't authorized to update this user",
      );
    }
    if (countNewlines(updateUserDto.bio || '') > 8) {
      throw new BadRequestException('Bio field contains too many lines');
    }
    return this.userDataService.update(user.id, updateUserDto);
  }
}
