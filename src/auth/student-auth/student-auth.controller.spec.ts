import { Test, TestingModule } from '@nestjs/testing';
import { StudentAuthController } from './student-auth.controller';

describe('StudentAuthController', () => {
  let controller: StudentAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAuthController],
    }).compile();

    controller = module.get<StudentAuthController>(StudentAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
