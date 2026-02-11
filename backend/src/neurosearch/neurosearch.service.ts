import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NeuroSearchService {
  private readonly logger = new Logger(NeuroSearchService.name);

  constructor(private prisma: PrismaService) {}

  async search(query: string, userId: string, filters?: { caseId?: string; type?: string }) {
    this.logger.log(`NeuroSearch query: "${query}" by user ${userId}`);

    const where: any = { deletedAt: null };
    if (filters?.caseId) where.caseId = filters.caseId;
    if (filters?.type) where.type = filters.type;

    // Keyword search across evidence fields and AI results
    const evidenceResults = await this.prisma.evidence.findMany({
      where: {
        ...where,
        OR: [
          { fileName: { contains: query, mode: 'insensitive' } },
          { mimeType: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        case: { select: { id: true, title: true, caseNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Search in AI results (JSON field search)
    const aiResults = await this.prisma.evidence.findMany({
      where: {
        ...where,
        aiStatus: 'COMPLETED',
        aiResult: { not: null },
      },
      include: {
        case: { select: { id: true, title: true, caseNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Filter AI results that contain the query in their JSON
    const queryLower = query.toLowerCase();
    const aiMatches = aiResults.filter((ev) => {
      const aiJson = JSON.stringify(ev.aiResult).toLowerCase();
      return aiJson.includes(queryLower);
    });

    // Search cases by title/description
    const caseResults = await this.prisma.case.findMany({
      where: {
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query.toLowerCase() } },
          { caseNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: { select: { evidence: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    // Merge and deduplicate evidence results
    const allEvidence = [...evidenceResults, ...aiMatches];
    const seen = new Set<string>();
    const uniqueEvidence = allEvidence.filter((ev) => {
      if (seen.has(ev.id)) return false;
      seen.add(ev.id);
      return true;
    });

    // Audit the search
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'NEUROSEARCH_QUERY',
        resource: 'search',
        details: {
          query,
          filters,
          resultsCount: uniqueEvidence.length + caseResults.length,
        },
      },
    });

    return {
      query,
      results: {
        evidence: uniqueEvidence.slice(0, 50),
        cases: caseResults,
      },
      totalResults: uniqueEvidence.length + caseResults.length,
      searchedAt: new Date().toISOString(),
      engineVersion: '7.0.0-keyword',
      note: 'Vector search (pgvector) available in v8.0',
    };
  }

  async suggest(query: string) {
    // Basic suggestion engine based on existing data
    const tags = await this.prisma.case.findMany({
      where: { deletedAt: null },
      select: { tags: true },
      take: 100,
    });

    const allTags = tags.flatMap((c) => c.tags);
    const uniqueTags = [...new Set(allTags)];
    const suggestions = uniqueTags
      .filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);

    return { query, suggestions };
  }
}
