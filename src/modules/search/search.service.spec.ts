import { SearchService } from './search.service';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { MainLoggerService } from 'src/utils/main-logger';

describe('SearchService', () => {
  let service: SearchService;
  let mockUserRepository: MockProxy<Repository<User>>;
  let mockLogger: MockProxy<MainLoggerService>;

  beforeAll(async () => {
    mockUserRepository = mock<Repository<User>>({
      createQueryBuilder: jest.fn(),
    });

    mockLogger = mock<MainLoggerService>({
      error: jest.fn(),
    });

    service = new SearchService(mockUserRepository, mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#paginateByUser', () => {
    it('should paginate by user', async () => {
      await service.paginateByUser('test', {
        page: 1,
        limit: 10,
      });

      expect(mockUserRepository.createQueryBuilder).toBeCalledTimes(1);
    });
  });

  describe('#paginateByOrganization', () => {
    it('should paginate by organization', async () => {
      await service.paginateByOrganization('test', {
        page: 1,
        limit: 10,
      });

      expect(mockUserRepository.createQueryBuilder).toBeCalledTimes(1);
    });
  });
});
