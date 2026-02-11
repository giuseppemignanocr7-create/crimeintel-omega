import { Module } from '@nestjs/common';
import { HyperFusionService } from './hyperfusion.service';
import { HyperFusionController } from './hyperfusion.controller';

@Module({
  providers: [HyperFusionService],
  controllers: [HyperFusionController],
  exports: [HyperFusionService],
})
export class HyperFusionModule {}
