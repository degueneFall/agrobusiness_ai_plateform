import { Test, TestingModule } from '@nestjs/testing';
import { SoilMappingController } from './soil-mapping.controller';

describe('SoilMappingController', () => {
  let controller: SoilMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoilMappingController],
    }).compile();

    controller = module.get<SoilMappingController>(SoilMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
