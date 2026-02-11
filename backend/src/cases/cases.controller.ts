import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCaseDto, UpdateCaseDto, CaseQueryDto } from '../common/dto/case.dto';

@ApiTags('cases')
@ApiBearerAuth()
@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({ status: 201, description: 'Case created' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCaseDto) {
    return this.casesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all cases with pagination' })
  findAll(@CurrentUser('id') userId: string, @Query() query: CaseQueryDto) {
    return this.casesService.findAll(userId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get case statistics' })
  getStats(@CurrentUser('id') userId: string) {
    return this.casesService.getStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case details' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.casesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a case' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCaseDto,
  ) {
    return this.casesService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a case' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.casesService.softDelete(id, userId);
  }
}
