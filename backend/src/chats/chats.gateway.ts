import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import * as jwt from 'jsonwebtoken';
import { UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  user: any;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chats',
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      console.log('trying to connect to ws');
      const authHeader = client.handshake.headers.authorization || client.handshake.auth?.token;
      if (!authHeader) {
        console.error('Missing token. Cant connect to WebSocket');
        throw new UnauthorizedException('Missing token');
      }

      const token = authHeader.split(' ')[1] || authHeader;
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      
      const payload = jwt.verify(token, secret);
      
      const user = await this.prisma.user.findUnique({
        where: { id: (payload as any).sub }
      });

      if (!user) {
        console.error('User not found. Cant connect to WebSocket');
        throw new UnauthorizedException('User not found');
      }

      (client as AuthenticatedSocket).user = user;

      // Join a personal room to receive notifications / system updates
      client.join(`user_${user.id}`);
    } catch (error) {
      console.error('Authentication failed:', error.message); 
      // Mengirimkan event 'error' ke client sebelum memutus koneksi
      client.emit('error', { message: error.message || 'Authentication failed' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    // Optionally handle disconnect logic
  }

  @SubscribeMessage('joinCaseRoom')
  async handleJoinCaseRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody('caseId') caseId: string,
  ) {
    console.log("try join room")
    if (!client.user) return;
    console.log(`${client.user.name} joined case room ${caseId}`);
    
    // Join a room based on case ID to receive messages only for this case
    client.join(`case_${caseId}`);
    client.emit('joinCaseRoom', { success: true, caseId: caseId });
  }

  @SubscribeMessage('leaveCaseRoom')
  handleLeaveCaseRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody('caseId') caseId: string,
  ) {
    if (!client.user) return;
    console.log(`${client.user.name} left case room ${caseId}`);
    
    // Keluar dari room agar tidak lagi menerima pesan dari kasus ini
    client.leave(`case_${caseId}`);
    client.emit('leftCaseRoom', { success: true, caseId });
  }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: CreateChatDto & { attachments?: Array<{ filename: string, file_url: string }> },
  ) {
    console.log("try send message")
    if (!client.user) return;
    console.log(payload)
    try {
      const chat = await this.chatsService.saveMessage(
        payload.caseId,
        client.user.id,
        payload.message,
        payload.attachments
      );

      // Emit to everyone in the case room
      console.log(chat)
      this.server.to(`case_${payload.caseId}`).emit('newMessage', chat);
    } catch (error) {
      console.error('Failed to send message:', error.message);
      client.emit('error', { message: error.message || 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { caseId: string; isTyping: boolean },
  ) {
    if (!client.user) return;
    client.to(`case_${payload.caseId}`).emit('userTyping', {
      userId: client.user.id,
      name: client.user.name,
      isTyping: payload.isTyping
    });
  }
}
