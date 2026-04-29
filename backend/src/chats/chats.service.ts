import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../prisma/generated/client/client';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyCaseAccess(caseId: string, user: User) {
    const targetCase = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: {
        client: { include: { user: true } },
        lawyer: { include: { user: true } }
      }
    });

    if (!targetCase) {
      throw new NotFoundException('Case not found');
    }

    const isClient = targetCase.client.user.id === user.id;
    const isLawyer = targetCase.lawyer?.user?.id === user.id;

    if (!isClient && !isLawyer) {
      throw new ForbiddenException('You do not have access to this case chat');
    }

    return targetCase;
  }

  async getHistory(caseId: string, user: User, pagination: { cursor?: string; limit: number }) {
    await this.verifyCaseAccess(caseId, user);
    
    const { cursor, limit } = pagination;

    const chats = await this.prisma.chat.findMany({
      where: { case_id: caseId },
      include: { sender: { select: { id: true, name: true, role: true } }, files: true },
      orderBy: { created_at: 'desc' }, // Descending so client gets latest messages first
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = chats.length === limit ? chats[chats.length - 1].id : null;

    // Reverse chats so it's chronologically ordered for UI
    const reversedChats = chats.reverse(); 

    // Mark messages as read if the current user isn't the sender
    const unreadMessages = reversedChats.filter(c => c.sender_id !== user.id && c.status !== 'READ');
    if (unreadMessages.length > 0) {
      await this.prisma.chat.updateMany({
        where: { id: { in: unreadMessages.map(c => c.id) } },
        data: { status: 'READ' }
      });
    }

    return {
      status: 'success',
      data: {
        chats: reversedChats,
        meta: {
          next_cursor: nextCursor,
          per_page: limit,
          has_more: nextCursor !== null
        }
      }
    };
  }

  async handleFileUpload(caseId: string, file: Express.Multer.File, user: User) {
    await this.verifyCaseAccess(caseId, user);

    const fileUrl = `/uploads/chats/${file.filename}`;
    
    return {
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        filename: file.originalname,
        file_url: fileUrl,
        mime_type: file.mimetype,
        size: file.size
      }
    };
  }

  async saveMessage(caseId: string, senderId: string, messageText: string, attachments: Array<{ filename: string, file_url: string }> = []) {
    // Basic verification is usually done at connection, but we can trust gateway passed valid data
    const chat = await this.prisma.chat.create({
      data: {
        case_id: caseId,
        sender_id: senderId,
        message: messageText,
        files: attachments.length > 0 ? {
          create: attachments.map(att => ({
            filename: att.filename,
            file_url: att.file_url
          }))
        } : undefined
      },
      include: { 
        sender: { select: { id: true, name: true, role: true } }, 
        files: true,
        case: {
          include: {
            client: { include: { user: { select: { id: true } } } },
            lawyer: { include: { user: { select: { id: true } } } }
          }
        }
      }
    });

    return chat;
  }
}
