import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private root = process.env.STORAGE_ROOT || './uploads';

  async saveFile(buffer: Buffer, originalName: string, caseId: string) {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const ext = path.extname(originalName);
    const dir = path.join(this.root, caseId);

    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${hash}${ext}`);
    await fs.writeFile(filePath, buffer);

    this.logger.log(`File saved: ${filePath} (${buffer.length} bytes)`);

    return {
      filePath,
      hash,
      fileName: originalName,
      fileSize: buffer.length,
    };
  }

  async getFile(filePath: string): Promise<Buffer> {
    return fs.readFile(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      this.logger.log(`File deleted: ${filePath}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file: ${filePath}`);
    }
  }

  computeHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
