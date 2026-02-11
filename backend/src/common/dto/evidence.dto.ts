import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadEvidenceDto {
  @ApiProperty({ example: 'uuid-of-case' })
  @IsUUID()
  caseId: string;

  @ApiPropertyOptional({ example: '{"gps":{"lat":41.9,"lng":12.5}}' })
  @IsOptional()
  @IsString()
  metadata?: string;
}

export class SearchEvidenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  caseId?: string;
}
