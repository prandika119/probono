import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { AskChatbotDto, CreateSessionDto } from './dto/ask-chatbot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * POST /chatbot/sessions
   * Membuat sesi percakapan baru untuk user yang sedang login.
   */
  @Post('sessions')
  createSession(@Request() req, @Body() dto: CreateSessionDto) {
    return this.chatbotService.createSession(req.user.id, dto.title);
  }

  /**
   * GET /chatbot/sessions
   * Mengambil daftar semua sesi percakapan milik user yang sedang login.
   */
  @Get('sessions')
  getSessions(@Request() req) {
    return this.chatbotService.getSessions(req.user.id);
  }

  /**
   * GET /chatbot/sessions/:id/messages
   * Mengambil seluruh riwayat pesan dalam satu sesi tertentu.
   */
  @Get('sessions/:id/messages')
  getMessages(@Param('id') sessionId: string, @Request() req) {
    return this.chatbotService.getMessages(sessionId, req.user.id);
  }

  /**
   * POST /chatbot/sessions/:id/ask
   * Mengirimkan pertanyaan ke AI dan mendapatkan jawaban berbasis RAG.
   * Ini adalah endpoint utama chatbot.
   */
  @Post('sessions/:id/ask')
  ask(
    @Param('id') sessionId: string,
    @Request() req,
    @Body() dto: AskChatbotDto,
  ) {
    return this.chatbotService.ask(sessionId, req.user.id, dto.question);
  }
}
