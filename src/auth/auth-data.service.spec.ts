import { Test, TestingModule } from '@nestjs/testing';
import { AuthDataService } from './auth-data.service';

describe('AuthDataService', () => {
  let service: AuthDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthDataService],
    }).compile();

    service = module.get<AuthDataService>(AuthDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
