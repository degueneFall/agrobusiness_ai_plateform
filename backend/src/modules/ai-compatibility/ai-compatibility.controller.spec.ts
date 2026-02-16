import { Test, TestingModule } from '@nestjs/testing';
import { AiCompatibilityController } from './ai-compatibility.controller';

describe('AiCompatibilityController', () => {
  let controller: AiCompatibilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiCompatibilityController],
    }).compile();

    controller = module.get<AiCompatibilityController>(AiCompatibilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
