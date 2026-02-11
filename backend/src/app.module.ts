import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CasesModule } from './cases/cases.module';
import { EvidenceModule } from './evidence/evidence.module';
import { HyperFusionModule } from './hyperfusion/hyperfusion.module';
import { NeuroSearchModule } from './neurosearch/neurosearch.module';
import { AIModule } from './ai/ai.module';
import { StorageModule } from './storage/storage.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,   // 1 second
        limit: 10,   // 10 requests
      },
      {
        name: 'medium',
        ttl: 60000,  // 1 minute
        limit: 100,  // 100 requests
      },
    ]),
    DatabaseModule,
    AuthModule,
    CasesModule,
    EvidenceModule,
    HyperFusionModule,
    NeuroSearchModule,
    AIModule,
    StorageModule,
    HealthModule,
    AuditModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
