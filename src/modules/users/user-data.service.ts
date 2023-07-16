import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { MainLoggerService } from 'src/utils/main-logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuth } from 'src/entities/user-auth.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
    private readonly logger: MainLoggerService,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAllIncludingUsername(): Promise<User[]> {
    try {
      return this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userAuth', 'userAuth')
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findUserRoleById(id: string): Promise<string> {
    try {
      const user = await this.userAuthRepository.findOne({ where: { id } });
      return user.role;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    try {
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      return this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userAuth', 'userAuth')
        .where('userAuth.username = :username', { username })
        .getOne();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getIdByUsername(username: string): Promise<string> {
    try {
      const user = await this.userAuthRepository
        .createQueryBuilder('userAuth')
        .select('userAuth.id')
        .where('userAuth.username = :username', { username })
        .getOne();
      return user.id;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Implement the logic to save the user to your data store
    const newUser = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Error if updated email already exists
    const { email } = updateUserDto;
    const userWithEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (userWithEmail && userWithEmail.id !== id) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    let user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user = Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async saveAvatar(
    id: string,
    updateAvatarDto: UpdateAvatarDto,
  ): Promise<User> {
    let user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user = Object.assign(user, updateAvatarDto);
    return this.userRepository.save(user);
  }

  async getAvatarById(id: string): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .select('user.avatar')
        .where('user.id = :id', { id })
        .getOne();
      return user.avatar;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAvatarByUsername(username: string): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .select('user.avatar')
        .leftJoin('user.userAuth', 'userAuth')
        .where('userAuth.username = :username', { username })
        .getOne();
      return user.avatar;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

export default UserDataService;
