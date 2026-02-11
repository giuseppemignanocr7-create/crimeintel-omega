import { Module } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { EvidenceController } from './evidence.controller';
import { StorageModule } from '../storage/storage.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [StorageModule, AIModule],
  providers: [EvidenceService],
  controllers: [EvidenceController],
  exports: [EvidenceService],
})
export class EvidenceModule {}
