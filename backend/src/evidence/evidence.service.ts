import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AIService } from '../ai/ai.service';
import { EvidenceType } from '@prisma/client';

@Injectable()
export class EvidenceService {
  private readonly logger = new Logger(EvidenceService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private ai: AIService,
  ) {}

  async upload(
    file: Express.Multer.File,
    caseId: string,
    userId: string,
    metadata?: string,
  ) {
    // Verify case exists
    const caseExists = await this.prisma.case.findFirst({
      where: { id: caseId, deletedAt: null },
    });
    if (!caseExists) throw new NotFoundException('Case not found');

    // Save file and compute hash
    const saved = await this.storage.saveFile(file.buffer, file.originalname, caseId);

    // Check for duplicate hash
    const duplicate = await this.prisma.evidence.findUnique({
      where: { hash: saved.hash },
    });
    if (duplicate) {
      throw new ConflictException(`Duplicate evidence detected (hash: ${saved.hash.substring(0, 16)}...)`);
    }

    // Determine evidence type from MIME
    const type = this.classifyType(file.mimetype);

    // Parse metadata if provided
    let parsedMetadata = null;
    if (metadata) {
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch {
        parsedMetadata = { raw: metadata };
      }
    }

    // Create evidence record
    const evidence = await this.prisma.evidence.create({
      data: {
        caseId,
        type,
        filePath: saved.filePath,
        fileName: saved.fileName,
        fileSize: saved.fileSize,
        mimeType: file.mimetype,
        hash: saved.hash,
        metadata: parsedMetadata,
      },
    });

    // Create chain of custody entry
    await this.prisma.chain.create({
      data: {
        evidenceId: evidence.id,
        hash: saved.hash,
        userId,
        action: 'UPLOAD',
        notes: `Uploaded ${file.originalname} (${type})`,
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'EVIDENCE_UPLOADED',
        resource: 'evidence',
        targetId: evidence.id,
        details: { caseId, fileName: file.originalname, type, hash: saved.hash },
      },
    });

    // Queue AI analysis (async, non-blocking)
    this.queueAIAnalysis(evidence.id, type, saved.filePath).catch((err) =>
      this.logger.error(`AI analysis queue failed for ${evidence.id}: ${err.message}`),
    );

    this.logger.log(`Evidence uploaded: ${evidence.id} for case ${caseId}`);
    return evidence;
  }

  async findByCaseId(caseId: string) {
    return this.prisma.evidence.findMany({
      where: { caseId, deletedAt: null },
      include: {
        chain: { orderBy: { timestamp: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const evidence = await this.prisma.evidence.findFirst({
      where: { id, deletedAt: null },
      include: {
        chain: { orderBy: { timestamp: 'desc' } },
        case: { select: { id: true, title: true, caseNumber: true } },
      },
    });
    if (!evidence) throw new NotFoundException('Evidence not found');

    // Log access in chain of custody
    if (userId) {
      await this.prisma.chain.create({
        data: {
          evidenceId: id,
          hash: evidence.hash,
          userId,
          action: 'ACCESS',
          notes: 'Evidence viewed',
        },
      });
    }

    return evidence;
  }

  async getChainOfCustody(evidenceId: string) {
    const evidence = await this.prisma.evidence.findFirst({
      where: { id: evidenceId, deletedAt: null },
    });
    if (!evidence) throw new NotFoundException('Evidence not found');

    return this.prisma.chain.findMany({
      where: { evidenceId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async verifyIntegrity(evidenceId: string) {
    const evidence = await this.prisma.evidence.findFirst({
      where: { id: evidenceId, deletedAt: null },
    });
    if (!evidence) throw new NotFoundException('Evidence not found');

    try {
      const fileBuffer = await this.storage.getFile(evidence.filePath);
      const currentHash = this.storage.computeHash(fileBuffer);
      const isValid = currentHash === evidence.hash;

      return {
        evidenceId,
        storedHash: evidence.hash,
        currentHash,
        isValid,
        verifiedAt: new Date().toISOString(),
      };
    } catch {
      return {
        evidenceId,
        storedHash: evidence.hash,
        currentHash: null,
        isValid: false,
        error: 'File not accessible',
        verifiedAt: new Date().toISOString(),
      };
    }
  }

  async softDelete(id: string, userId: string) {
    const evidence = await this.prisma.evidence.findFirst({
      where: { id, deletedAt: null },
    });
    if (!evidence) throw new NotFoundException('Evidence not found');

    await this.prisma.evidence.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.chain.create({
      data: {
        evidenceId: id,
        hash: evidence.hash,
        userId,
        action: 'DELETE',
        notes: 'Evidence soft-deleted',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'EVIDENCE_DELETED',
        resource: 'evidence',
        targetId: id,
      },
    });

    return { message: 'Evidence deleted' };
  }

  private classifyType(mimeType: string): EvidenceType {
    if (mimeType.startsWith('image/')) return EvidenceType.IMAGE;
    if (mimeType.startsWith('video/')) return EvidenceType.VIDEO;
    if (mimeType.startsWith('audio/')) return EvidenceType.AUDIO;
    return EvidenceType.DOCUMENT;
  }

  private async queueAIAnalysis(evidenceId: string, type: EvidenceType, filePath: string) {
    await this.prisma.evidence.update({
      where: { id: evidenceId },
      data: { aiStatus: 'PROCESSING' },
    });

    try {
      const result = await this.ai.analyze(type, filePath);
      await this.prisma.evidence.update({
        where: { id: evidenceId },
        data: { aiResult: result as any, aiStatus: 'COMPLETED' },
      });
      this.logger.log(`AI analysis completed for evidence ${evidenceId}`);
    } catch (error) {
      await this.prisma.evidence.update({
        where: { id: evidenceId },
        data: { aiStatus: 'FAILED', aiResult: { error: error.message } as any },
      });
      this.logger.error(`AI analysis failed for evidence ${evidenceId}: ${error.message}`);
    }
  }
}
