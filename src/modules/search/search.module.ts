import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { User } from '../../entities/users/user.entity';
import { MainLoggerService } from 'src/utils/main-logger';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SearchController],
  providers: [SearchService, MainLoggerService],
})
export class SearchModule {}
