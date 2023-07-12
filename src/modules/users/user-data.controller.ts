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
} from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { UserDataService } from 'src/modules/users/user-data.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  async findAll(): Promise<User[]> {
    return this.userDataService.findAllWithUsername();
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['student', 'admin'])
  async findByUsername(@Param('username') username: string): Promise<User> {
    return this.userDataService.findByUsername(username);
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
    return this.userDataService.update(user.id, updateUserDto);
  }
}
