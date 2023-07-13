import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async findUserByString(
    @Query('q') searchString: string,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.searchService.paginateByUser(searchString, {
      page,
      limit,
    });
  }
}
