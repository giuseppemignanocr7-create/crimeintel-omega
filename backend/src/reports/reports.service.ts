import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReportType } from '@prisma/client';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  async generate(caseId: string, type: ReportType, userId: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, deletedAt: null },
      include: {
        evidence: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        fusion: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
    if (!caseData) throw new NotFoundException('Case not found');

    // Build report payload based on type
    const payload = this.buildPayload(caseData, type);

    const report = await this.prisma.report.create({
      data: {
        caseId,
        type,
        payload: payload as any,
        generatedBy: userId,
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'REPORT_GENERATED',
        resource: 'report',
        targetId: report.id,
        details: { caseId, type },
      },
    });

    this.logger.log(`Report generated: ${report.id} (${type}) for case ${caseId}`);
    return report;
  }

  async findByCaseId(caseId: string) {
    return this.prisma.report.findMany({
      where: { caseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  private buildPayload(caseData: any, type: ReportType): Record<string, any> {
    const base = {
      reportType: type,
      generatedAt: new Date().toISOString(),
      version: '7.0.0',
      case: {
        id: caseData.id,
        caseNumber: caseData.caseNumber,
        title: caseData.title,
        description: caseData.description,
        status: caseData.status,
        priority: caseData.priority,
        location: {
          lat: caseData.locationLat,
          lng: caseData.locationLng,
          name: caseData.locationName,
        },
        investigator: caseData.user,
        createdAt: caseData.createdAt,
        updatedAt: caseData.updatedAt,
      },
    };

    switch (type) {
      case 'SUMMARY':
        return {
          ...base,
          evidenceCount: caseData.evidence.length,
          evidenceSummary: caseData.evidence.map((e: any) => ({
            id: e.id,
            type: e.type,
            fileName: e.fileName,
            aiStatus: e.aiStatus,
            hash: e.hash,
          })),
          fusion: caseData.fusion
            ? {
                score: caseData.fusion.fusionScore,
                confidence: caseData.fusion.confidence,
                version: caseData.fusion.version,
              }
            : null,
        };

      case 'DETAILED':
        return {
          ...base,
          evidence: caseData.evidence.map((e: any) => ({
            id: e.id,
            type: e.type,
            fileName: e.fileName,
            fileSize: e.fileSize,
            hash: e.hash,
            aiStatus: e.aiStatus,
            aiResult: e.aiResult,
            metadata: e.metadata,
            createdAt: e.createdAt,
          })),
          fusion: caseData.fusion?.fusionData || null,
        };

      case 'FORENSIC':
        return {
          ...base,
          chainOfCustody: 'See individual evidence chain records',
          evidenceIntegrity: caseData.evidence.map((e: any) => ({
            id: e.id,
            fileName: e.fileName,
            hash: e.hash,
            type: e.type,
            createdAt: e.createdAt,
          })),
          note: 'PDF generation with full chain of custody available in v8.0',
        };

      case 'TIMELINE':
        return {
          ...base,
          timeline: caseData.evidence
            .map((e: any) => ({
              timestamp: e.createdAt,
              type: e.type,
              fileName: e.fileName,
              summary: (e.aiResult as any)?.summary || 'No AI summary',
            }))
            .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        };

      default:
        return base;
    }
  }
}
