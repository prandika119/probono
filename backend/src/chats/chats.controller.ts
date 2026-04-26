import { Controller, Get, Post, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Request, ParseUUIDPipe } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedExtensions = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
  const ext = extname(file.originalname).toLowerCase();
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only images, pdf, word, and excel files are allowed'), false);
  }
};

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get(':caseId/history')
  async getChatHistory(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Query('cursor') cursor: string,
    @Query('limit') limit: string = '20',
    @Request() req
  ) {
    return this.chatsService.getHistory(caseId, req.user, { cursor, limit: Number(limit) });
  }

  @Post(':caseId/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/chats',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter
  }))
  async uploadFile(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.chatsService.handleFileUpload(caseId, file, req.user);
  }
}
