import { Injectable, Logger } from '@nestjs/common';
import { EvidenceType } from '@prisma/client';
import { ImageAnalyzer } from './analyzers/image.analyzer';
import { VideoAnalyzer } from './analyzers/video.analyzer';
import { AudioAnalyzer } from './analyzers/audio.analyzer';
import { LPRAnalyzer } from './analyzers/lpr.analyzer';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private imageAnalyzer: ImageAnalyzer,
    private videoAnalyzer: VideoAnalyzer,
    private audioAnalyzer: AudioAnalyzer,
    private lprAnalyzer: LPRAnalyzer,
  ) {}

  async analyze(type: EvidenceType, filePath: string): Promise<Record<string, any>> {
    this.logger.log(`Starting AI analysis: type=${type}, file=${filePath}`);
    const start = Date.now();

    let result: Record<string, any>;

    switch (type) {
      case EvidenceType.IMAGE:
        result = await this.imageAnalyzer.analyze(filePath);
        break;
      case EvidenceType.VIDEO:
        result = await this.videoAnalyzer.analyze(filePath);
        break;
      case EvidenceType.AUDIO:
        result = await this.audioAnalyzer.analyze(filePath);
        break;
      case EvidenceType.PLATE:
        result = await this.lprAnalyzer.analyze(filePath);
        break;
      default:
        result = { type: 'document', message: 'Document analysis not yet implemented' };
    }

    const duration = Date.now() - start;
    this.logger.log(`AI analysis completed in ${duration}ms for ${type}`);

    return {
      ...result,
      analyzedAt: new Date().toISOString(),
      processingTimeMs: duration,
      engineVersion: '7.0.0-stub',
    };
  }
}
