import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlotsService } from './plots.service';
import { PlotsController } from './plots.controller';
import { Plot } from './entities/plot.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plot]), forwardRef(() => AuthModule)],
  providers: [PlotsService],
  controllers: [PlotsController],
  exports: [PlotsService],
})
export class PlotsModule {}
