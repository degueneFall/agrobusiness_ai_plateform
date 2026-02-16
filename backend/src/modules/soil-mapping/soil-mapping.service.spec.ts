import { Test, TestingModule } from '@nestjs/testing';
import { SoilMappingService } from './soil-mapping.service';

describe('SoilMappingService', () => {
  let service: SoilMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoilMappingService],
    }).compile();

    service = module.get<SoilMappingService>(SoilMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
