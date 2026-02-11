import { Controller, Post, Get, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReportType } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post(':caseId/generate')
  @ApiOperation({ summary: 'Generate a report for a case' })
  @ApiQuery({ name: 'type', enum: ReportType, required: false })
  @ApiResponse({ status: 201, description: 'Report generated' })
  generate(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @CurrentUser('id') userId: string,
    @Query('type') type?: ReportType,
  ) {
    return this.reportsService.generate(caseId, type || ReportType.SUMMARY, userId);
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'List reports for a case' })
  findByCaseId(@Param('caseId', ParseUUIDPipe) caseId: string) {
    return this.reportsService.findByCaseId(caseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific report' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.findOne(id);
  }
}
