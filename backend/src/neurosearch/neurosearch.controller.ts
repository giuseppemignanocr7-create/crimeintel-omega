import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NeuroSearchService } from './neurosearch.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('neurosearch')
@ApiBearerAuth()
@Controller('neurosearch')
@UseGuards(JwtAuthGuard)
export class NeuroSearchController {
  constructor(private searchService: NeuroSearchService) {}

  @Get()
  @ApiOperation({ summary: 'Semantic search across all evidence and cases' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'caseId', required: false })
  @ApiQuery({ name: 'type', required: false })
  search(
    @Query('q') query: string,
    @CurrentUser('id') userId: string,
    @Query('caseId') caseId?: string,
    @Query('type') type?: string,
  ) {
    return this.searchService.search(query, userId, { caseId, type });
  }

  @Get('suggest')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiQuery({ name: 'q', required: true })
  suggest(@Query('q') query: string) {
    return this.searchService.suggest(query);
  }
}
