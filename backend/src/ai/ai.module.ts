import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { ImageAnalyzer } from './analyzers/image.analyzer';
import { VideoAnalyzer } from './analyzers/video.analyzer';
import { AudioAnalyzer } from './analyzers/audio.analyzer';
import { LPRAnalyzer } from './analyzers/lpr.analyzer';

@Module({
  providers: [AIService, ImageAnalyzer, VideoAnalyzer, AudioAnalyzer, LPRAnalyzer],
  exports: [AIService],
})
export class AIModule {}
