import { Module } from '@nestjs/common';
import { NeuroSearchService } from './neurosearch.service';
import { NeuroSearchController } from './neurosearch.controller';

@Module({
  providers: [NeuroSearchService],
  controllers: [NeuroSearchController],
  exports: [NeuroSearchService],
})
export class NeuroSearchModule {}
