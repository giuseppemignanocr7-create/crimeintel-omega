import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

export interface FileValidationOptions {
  maxSize?: number; // bytes
  allowedMimeTypes?: string[];
}

const DEFAULT_MAX_SIZE = 100 * 1024 * 1024; // 100MB
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
  'video/mp4',
  'video/avi',
  'video/quicktime',
  'video/x-msvideo',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private maxSize: number;
  private allowedMimeTypes: string[];

  constructor(options?: FileValidationOptions) {
    this.maxSize = options?.maxSize || DEFAULT_MAX_SIZE;
    this.allowedMimeTypes = options?.allowedMimeTypes || DEFAULT_ALLOWED_TYPES;
  }

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File too large. Max size: ${Math.round(this.maxSize / 1024 / 1024)}MB`,
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type not allowed: ${file.mimetype}. Allowed: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    return file;
  }
}
