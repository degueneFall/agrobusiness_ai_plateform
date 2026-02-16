import { Test, TestingModule } from '@nestjs/testing';
import { AiCompatibilityService } from './ai-compatibility.service';

describe('AiCompatibilityService', () => {
  let service: AiCompatibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiCompatibilityService],
    }).compile();

    service = module.get<AiCompatibilityService>(AiCompatibilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
