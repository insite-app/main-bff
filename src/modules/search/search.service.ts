import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async paginateByUser(
    searchString: string,
    options: { page: number; limit: number },
  ): Promise<{ data: User[]; total: number }> {
    try {
      const [data, total] = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.userAuth', 'userAuth')
        .addSelect('userAuth.username')
        .where(
          'user.name ILIKE :searchString OR user.organization_name ILIKE :searchString OR userAuth.username ILIKE :searchString',
          {
            searchString: `%${searchString}%`,
          },
        )
        .skip((options.page - 1) * options.limit)
        .take(options.limit)
        .getManyAndCount();
      return { data, total };
    } catch (error) {
      console.log(error);
    }
  }

  async paginateByOrganization(
    searchString: string,
    options: { page: number; limit: number },
  ): Promise<{ data: User[]; total: number }> {
    try {
      const [data, total] = await this.userRepository
        .createQueryBuilder('user')
        .where('user.organization_name ILIKE :searchString', {
          searchString: `%${searchString}%`,
        })
        .skip((options.page - 1) * options.limit)
        .take(options.limit)
        .getManyAndCount();
      return { data, total };
    } catch (error) {
      console.log(error);
    }
  }
}
