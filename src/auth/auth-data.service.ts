import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from 'src/entities/auth/user-auth.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { MainLoggerService } from 'src/utils/main-logger';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthDataService {
  constructor(
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
    private readonly logger: MainLoggerService,
  ) {}

  async findUserByUsername(username: string): Promise<UserAuth> {
    try {
      return this.userAuthRepository.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createUserAuth(createUserDto: CreateUserDto): Promise<UserAuth> {
    try {
      const { password, ...rest } = createUserDto;

      const passwordHash = await bcrypt.hash(password, 10);

      const userAuth = await this.userAuthRepository.save({
        password_hash: passwordHash,
        ...rest,
      });

      return userAuth;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
