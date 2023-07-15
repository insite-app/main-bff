import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('SearchController', () => {
  let controller: SearchController;
  let mockSearchService: MockProxy<SearchService>;

  beforeEach(async () => {
    mockSearchService = mock<SearchService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [{ provide: SearchService, useValue: mockSearchService }],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  describe('#findUserByString', () => {
    it('should call SearchService.paginateByUser with the correct parameters', async () => {
      const searchString = 'test';
      const page = 1;
      const limit = 5;

      mockSearchService.paginateByUser.mockResolvedValue({
        data: [],
        total: 0,
      });

      await controller.findUserByString(searchString, page, limit);

      expect(mockSearchService.paginateByUser).toBeCalledWith(searchString, {
        page,
        limit,
      });
    });

    it('should limit the results to a maximum of 100 per page', async () => {
      const searchString = 'test';
      const page = 1;
      const limit = 200;

      mockSearchService.paginateByUser.mockResolvedValue({
        data: [],
        total: 0,
      });

      await controller.findUserByString(searchString, page, limit);

      expect(mockSearchService.paginateByUser).toBeCalledWith(searchString, {
        page,
        limit: 100, // limit is capped to 100
      });
    });
  });
});
