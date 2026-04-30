import { Controller, Get, Param, Res, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { existsSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('uploads/private')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly jwtService: JwtService) {}

  @Get(':folder/:filename')
  async getPrivateFile(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'private', folder, filename);
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    return res.sendFile(filePath);
  }
}
