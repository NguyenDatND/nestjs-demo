import { Test, TestingModule } from '@nestjs/testing';
import { PermisionsController } from './permisions.controller';
import { PermisionsService } from './permisions.service';

describe('PermisionsController', () => {
  let controller: PermisionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermisionsController],
      providers: [PermisionsService],
    }).compile();

    controller = module.get<PermisionsController>(PermisionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
