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
    @MessageBody() data: any,
  ) {
    const caseId = typeof data === 'string' ? data.trim() : data.caseId?.trim();
    
    if (!client.user) return;
    if (!caseId) {
      console.error('[WebSocket] joinCaseRoom failed: No caseId provided');
      return;
    }

    const roomName = `case_${caseId}`;
    console.log(`[WebSocket] User ${client.user.name} joining room: ${roomName}`);
    
    await client.join(roomName);
    
    // Log members in room for debugging
    const clients = await this.server.in(roomName).allSockets();
    console.log(`[WebSocket] Room ${roomName} now has ${clients.size} members`);
    
    client.emit('joinCaseRoom', { success: true, caseId: caseId });
  }

  @SubscribeMessage('leaveCaseRoom')
  async handleLeaveCaseRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    const caseId = typeof data === 'string' ? data.trim() : data.caseId?.trim();
    if (!client.user || !caseId) return;
    
    const roomName = `case_${caseId}`;
    console.log(`[WebSocket] User ${client.user.name} leaving room: ${roomName}`);
    await client.leave(roomName);
    client.emit('leftCaseRoom', { success: true, caseId });
  }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: CreateChatDto & { attachments?: Array<{ filename: string, file_url: string }> },
  ) {
    if (!client.user) return;
    
    const cleanCaseId = payload.caseId.trim();
    console.log(`[WebSocket] Message from ${client.user.name} for case ${cleanCaseId}: ${payload.message}`);
    
    try {
      const chat = await this.chatsService.saveMessage(
        cleanCaseId,
        client.user.id,
        payload.message,
        payload.attachments
      );

      const roomName = `case_${cleanCaseId}`;
      console.log(`[WebSocket] 📢 Siaran pesan ke room: ${roomName}`);
      
      // 1. Emit ke room kasus (standar)
      this.server.to(roomName).emit('newMessage', chat);
      
      // 2. Kirim ke pengirim (pribadi)
      this.server.to(`user_${client.user.id}`).emit('newMessage', chat);

      // 3. Cari lawan chat dan kirim ke room pribadinya
      const clientId = chat.case.client.user.id;
      const lawyerId = chat.case.lawyer?.user?.id;
      
      const recipientId = client.user.id === clientId ? lawyerId : clientId;
      
      if (recipientId) {
        console.log(`[WebSocket] 🎯 Mengirim langsung ke lawan chat: user_${recipientId}`);
        this.server.to(`user_${recipientId}`).emit('newMessage', chat);
      }
      
      // Log info tambahan untuk debug
      const sockets = await this.server.in(roomName).fetchSockets();
      console.log(`[WebSocket] Room ${roomName} members: ${sockets.length}`);
    } catch (error) {
      console.error('[WebSocket] Failed to send message:', error.message);
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
