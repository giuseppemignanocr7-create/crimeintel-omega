import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCaseDto, UpdateCaseDto, CaseQueryDto } from '../common/dto/case.dto';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCaseDto) {
    const created = await this.prisma.case.create({
      data: {
        ...dto,
        userId,
      },
    });

    // Audit
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CASE_CREATED',
        resource: 'case',
        targetId: created.id,
        details: { title: created.title },
      },
    });

    return created;
  }

  async findAll(userId: string, query: CaseQueryDto) {
    const { page = 1, limit = 20, status, priority, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { caseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        include: {
          _count: { select: { evidence: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.case.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const caseData = await this.prisma.case.findFirst({
      where: { id, deletedAt: null },
      include: {
        evidence: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        fusion: true,
        reports: { orderBy: { createdAt: 'desc' } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!caseData) throw new NotFoundException('Case not found');
    return caseData;
  }

  async update(id: string, userId: string, dto: UpdateCaseDto) {
    await this.ensureExists(id);

    const updated = await this.prisma.case.update({
      where: { id },
      data: dto,
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CASE_UPDATED',
        resource: 'case',
        targetId: id,
        details: JSON.parse(JSON.stringify(dto)),
      },
    });

    return updated;
  }

  async softDelete(id: string, userId: string) {
    await this.ensureExists(id);

    await this.prisma.case.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CASE_DELETED',
        resource: 'case',
        targetId: id,
      },
    });

    return { message: 'Case deleted' };
  }

  async getStats(userId: string) {
    const [total, open, active, evidence, aiAnalyzed] = await Promise.all([
      this.prisma.case.count({ where: { userId, deletedAt: null } }),
      this.prisma.case.count({ where: { userId, status: 'OPEN', deletedAt: null } }),
      this.prisma.case.count({ where: { userId, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.evidence.count({ where: { case: { userId }, deletedAt: null } }),
      this.prisma.evidence.count({
        where: { case: { userId }, aiStatus: 'COMPLETED', deletedAt: null },
      }),
    ]);

    return { total, open, active, evidence, aiAnalyzed };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.case.findFirst({
      where: { id, deletedAt: null },
    });
    if (!exists) throw new NotFoundException('Case not found');
  }
}
