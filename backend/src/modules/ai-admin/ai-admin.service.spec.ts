import { Test, TestingModule } from '@nestjs/testing';
import { AiAdminService } from './ai-admin.service';

describe('AiAdminService', () => {
  let service: AiAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiAdminService],
    }).compile();

    service = module.get<AiAdminService>(AiAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
