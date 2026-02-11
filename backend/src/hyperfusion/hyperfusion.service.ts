import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HyperFusionService {
  private readonly logger = new Logger(HyperFusionService.name);

  constructor(private prisma: PrismaService) {}

  async runFusion(caseId: string, userId: string) {
    // Verify case exists
    const caseData = await this.prisma.case.findFirst({
      where: { id: caseId, deletedAt: null },
      include: {
        evidence: {
          where: { deletedAt: null, aiStatus: 'COMPLETED' },
        },
      },
    });
    if (!caseData) throw new NotFoundException('Case not found');

    const evidenceList = caseData.evidence;
    if (evidenceList.length === 0) {
      return {
        caseId,
        message: 'No analyzed evidence available for fusion',
        fusionScore: 0,
        confidence: 0,
      };
    }

    // Extract entities from all AI results
    const entities = this.extractEntities(evidenceList);

    // Compute correlations
    const correlations = this.computeCorrelations(entities);

    // Build timeline from evidence timestamps and AI data
    const timeline = this.buildTimeline(evidenceList);

    // Compute confidence scores
    const confidenceBreakdown = this.computeConfidence(evidenceList, entities, correlations);

    // Detect conflicts
    const conflicts = this.detectConflicts(evidenceList, entities);

    // Identify gaps
    const gaps = this.identifyGaps(timeline, evidenceList);

    const fusionData = {
      entities,
      correlations,
      timeline,
      confidenceBreakdown,
      conflicts,
      gaps,
      evidenceCount: evidenceList.length,
      analyzedAt: new Date().toISOString(),
    };

    const fusionScore = confidenceBreakdown.overall;
    const confidence = confidenceBreakdown.overall;

    // Upsert fusion record
    const fusion = await this.prisma.fusion.upsert({
      where: { caseId },
      create: {
        caseId,
        fusionData: fusionData as any,
        fusionScore,
        confidence,
      },
      update: {
        fusionData: fusionData as any,
        fusionScore,
        confidence,
        version: { increment: 1 },
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'FUSION_EXECUTED',
        resource: 'fusion',
        targetId: caseId,
        details: { fusionScore, confidence, evidenceCount: evidenceList.length },
      },
    });

    this.logger.log(`HyperFusion completed for case ${caseId}: score=${fusionScore}`);
    return fusion;
  }

  async getFusion(caseId: string) {
    const fusion = await this.prisma.fusion.findUnique({ where: { caseId } });
    if (!fusion) throw new NotFoundException('No fusion data for this case');
    return fusion;
  }

  private extractEntities(evidenceList: any[]): Record<string, any[]> {
    const entities: Record<string, any[]> = {
      persons: [],
      vehicles: [],
      locations: [],
      objects: [],
      keywords: [],
    };

    for (const ev of evidenceList) {
      const ai = ev.aiResult as any;
      if (!ai) continue;

      // Extract persons (faces)
      if (ai.faces) {
        for (const face of ai.faces) {
          entities.persons.push({
            id: face.id,
            source: ev.id,
            confidence: face.confidence,
            attributes: face.attributes,
          });
        }
      }

      // Extract vehicles (plates)
      if (ai.plates) {
        for (const plate of ai.plates) {
          entities.vehicles.push({
            plate: plate.plateNormalized,
            source: ev.id,
            confidence: plate.confidence,
            vehicle: ai.vehicle,
          });
        }
      }

      // Extract locations (EXIF GPS)
      if (ai.exif?.gps) {
        entities.locations.push({
          lat: ai.exif.gps.lat,
          lng: ai.exif.gps.lng,
          source: ev.id,
          timestamp: ai.exif.timestamp,
        });
      }

      // Extract objects
      if (ai.objects) {
        for (const obj of ai.objects) {
          entities.objects.push({
            label: obj.label,
            confidence: obj.confidence,
            source: ev.id,
          });
        }
      }

      // Extract keywords (from audio)
      if (ai.keywords) {
        entities.keywords.push(...ai.keywords.map((k: string) => ({ keyword: k, source: ev.id })));
      }
    }

    return entities;
  }

  private computeCorrelations(entities: Record<string, any[]>): any[] {
    const correlations: any[] = [];

    // Person cross-evidence matching (same face in multiple evidence)
    const personSources = entities.persons.map((p) => p.source);
    if (new Set(personSources).size < personSources.length) {
      correlations.push({
        type: 'person_cross_evidence',
        description: 'Same person detected in multiple evidence items',
        confidence: 0.85,
        entities: entities.persons,
      });
    }

    // Vehicle cross-evidence matching
    const plates = entities.vehicles.map((v) => v.plate);
    const uniquePlates = [...new Set(plates)];
    for (const plate of uniquePlates) {
      const matches = entities.vehicles.filter((v) => v.plate === plate);
      if (matches.length > 1) {
        correlations.push({
          type: 'vehicle_cross_evidence',
          description: `Vehicle ${plate} appears in ${matches.length} evidence items`,
          confidence: 0.92,
          plate,
          sources: matches.map((m) => m.source),
        });
      }
    }

    return correlations;
  }

  private buildTimeline(evidenceList: any[]): any[] {
    return evidenceList
      .map((ev) => ({
        evidenceId: ev.id,
        type: ev.type,
        timestamp: ev.createdAt,
        aiTimestamp: (ev.aiResult as any)?.exif?.timestamp || null,
        summary: (ev.aiResult as any)?.summary || ev.fileName,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private computeConfidence(
    evidenceList: any[],
    entities: Record<string, any[]>,
    correlations: any[],
  ) {
    const totalEntities =
      entities.persons.length +
      entities.vehicles.length +
      entities.locations.length +
      entities.objects.length;

    const identityConfidence =
      entities.persons.length > 0
        ? entities.persons.reduce((sum, p) => sum + p.confidence, 0) / entities.persons.length
        : 0;

    const locationConfidence =
      entities.locations.length > 0
        ? Math.min(entities.locations.length / evidenceList.length, 1)
        : 0;

    const evidenceQuality =
      evidenceList.filter((e) => e.aiStatus === 'COMPLETED').length / evidenceList.length;

    const corroborationScore = Math.min(correlations.length * 0.2, 1);

    const overall =
      (identityConfidence * 0.3 +
        locationConfidence * 0.2 +
        evidenceQuality * 0.3 +
        corroborationScore * 0.2) || 0;

    return {
      overall: Math.round(overall * 100) / 100,
      identityConfidence: Math.round(identityConfidence * 100) / 100,
      locationConfidence: Math.round(locationConfidence * 100) / 100,
      evidenceQuality: Math.round(evidenceQuality * 100) / 100,
      corroborationScore: Math.round(corroborationScore * 100) / 100,
      totalEntities,
    };
  }

  private detectConflicts(evidenceList: any[], entities: Record<string, any[]>): any[] {
    const conflicts: any[] = [];

    // Check for GPS conflicts (same time, different locations)
    const locations = entities.locations.filter((l) => l.timestamp);
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        const timeDiff = Math.abs(
          new Date(locations[i].timestamp).getTime() - new Date(locations[j].timestamp).getTime(),
        );
        if (timeDiff < 1800000) {
          // 30 minutes
          const distance = this.haversineDistance(
            locations[i].lat,
            locations[i].lng,
            locations[j].lat,
            locations[j].lng,
          );
          if (distance > 50) {
            // 50km — impossible in 30min on foot
            conflicts.push({
              type: 'PHYSICAL_IMPOSSIBILITY',
              severity: 'HIGH',
              description: `Evidence ${locations[i].source} and ${locations[j].source} show ${distance.toFixed(1)}km apart within ${Math.round(timeDiff / 60000)} minutes`,
              sources: [locations[i].source, locations[j].source],
            });
          }
        }
      }
    }

    return conflicts;
  }

  private identifyGaps(timeline: any[], evidenceList: any[]): any[] {
    const gaps: any[] = [];

    for (let i = 1; i < timeline.length; i++) {
      const prev = new Date(timeline[i - 1].timestamp).getTime();
      const curr = new Date(timeline[i].timestamp).getTime();
      const gapMinutes = (curr - prev) / 60000;

      if (gapMinutes > 60) {
        gaps.push({
          type: 'TIMELINE_GAP',
          startTime: timeline[i - 1].timestamp,
          endTime: timeline[i].timestamp,
          durationMinutes: Math.round(gapMinutes),
          suggestion: `${Math.round(gapMinutes / 60)}h ${Math.round(gapMinutes % 60)}m gap — consider requesting additional CCTV or phone records`,
        });
      }
    }

    return gaps;
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
