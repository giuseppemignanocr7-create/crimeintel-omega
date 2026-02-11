import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { EvidenceService } from './evidence.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import { UploadEvidenceDto } from '../common/dto/evidence.dto';

@ApiTags('evidence')
@ApiBearerAuth()
@Controller('evidence')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvidenceController {
  constructor(private evidenceService: EvidenceService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload evidence file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Evidence uploaded' })
  @ApiResponse({ status: 409, description: 'Duplicate evidence' })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body() dto: UploadEvidenceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.evidenceService.upload(file, dto.caseId, userId, dto.metadata);
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'List evidence for a case' })
  findByCaseId(@Param('caseId', ParseUUIDPipe) caseId: string) {
    return this.evidenceService.findByCaseId(caseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evidence details' })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.evidenceService.findOne(id, userId);
  }

  @Get(':id/chain')
  @ApiOperation({ summary: 'Get chain of custody for evidence' })
  getChain(@Param('id', ParseUUIDPipe) id: string) {
    return this.evidenceService.getChainOfCustody(id);
  }

  @Get(':id/verify')
  @ApiOperation({ summary: 'Verify evidence integrity (SHA-256)' })
  verify(@Param('id', ParseUUIDPipe) id: string) {
    return this.evidenceService.verifyIntegrity(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete evidence' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.evidenceService.softDelete(id, userId);
  }
}
