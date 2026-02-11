import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    this.$on('error', (event) => {
      this.logger.error(`Prisma error: ${event.message}`);
    });

    if (process.env.NODE_ENV === 'development') {
      this.$on('query', (event) => {
        this.logger.debug(`Query: ${event.query} [${event.duration}ms]`);
      });
    }

    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('✅ Database connected');
        return;
      } catch (error) {
        retries--;
        this.logger.warn(`Database connection failed, ${retries} retries left...`);
        if (retries === 0) throw error;
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Helper for soft-delete filtered queries
   */
  excludeDeleted() {
    return { deletedAt: null };
  }
}
