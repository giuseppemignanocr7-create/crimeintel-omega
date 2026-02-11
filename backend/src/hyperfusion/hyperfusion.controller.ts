import { Controller, Post, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { HyperFusionService } from './hyperfusion.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('hyperfusion')
@ApiBearerAuth()
@Controller('hyperfusion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HyperFusionController {
  constructor(private fusionService: HyperFusionService) {}

  @Post(':caseId/run')
  @ApiOperation({ summary: 'Run HyperFusion AI analysis on a case' })
  @ApiResponse({ status: 200, description: 'Fusion completed' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.INVESTIGATOR, Role.ANALYST)
  runFusion(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.fusionService.runFusion(caseId, userId);
  }

  @Get(':caseId')
  @ApiOperation({ summary: 'Get fusion results for a case' })
  @ApiResponse({ status: 404, description: 'No fusion data' })
  getFusion(@Param('caseId', ParseUUIDPipe) caseId: string) {
    return this.fusionService.getFusion(caseId);
  }
}
