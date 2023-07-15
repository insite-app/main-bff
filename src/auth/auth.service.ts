import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDataService } from './auth-data.service';
import { UserDataService } from './../modules/users/user-data.service';
import { UserAuth } from 'src/entities/user-auth.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { MainLoggerService } from 'src/utils/main-logger';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDataService: AuthDataService,
    private readonly userDataService: UserDataService,
    private jwtService: JwtService,
    private readonly logger: MainLoggerService,
  ) {}

  async validate(username: string, password: string): Promise<UserAuth> {
    const userAuth = await this.authDataService.findUserByUsername(username);
    if (userAuth && (await bcrypt.compare(password, userAuth.password_hash))) {
      return userAuth;
    }
    return null;
  }

  async login(user: UserAuth) {
    const payload = {
      username: user.username,
      id: user.id,
    };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Check if the username is already taken
    const userAuthExists = await this.authDataService.findUserByUsername(
      createUserDto.username,
    );

    if (userAuthExists) {
      this.logger.error(`Username already taken: ${createUserDto.username}`);
      throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
    }
    const userAuth = await this.authDataService.createUserAuth(createUserDto);

    // Create the user profile record with the same ID as the authentication record
    const userProfile = await this.userDataService.create({
      ...createUserDto,
      id: userAuth.id,
    });

    return {
      userAuth,
      userProfile,
    };
  }

  async refresh(user: any) {
    const payload = {
      username: user.username,
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getUser(user: any) {
    try {
      const userInfo = await this.userDataService.findById(user.id);
      return {
        ...user,
        ...userInfo,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
