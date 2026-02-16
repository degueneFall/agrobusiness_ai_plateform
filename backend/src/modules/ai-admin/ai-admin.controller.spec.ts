import { Test, TestingModule } from '@nestjs/testing';
import { AiAdminController } from './ai-admin.controller';

describe('AiAdminController', () => {
  let controller: AiAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiAdminController],
    }).compile();

    controller = module.get<AiAdminController>(AiAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
