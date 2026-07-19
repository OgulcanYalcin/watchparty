import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;
      const payload = this.jwtService.verify<{ sub: string }>(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.data.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinEvent')
  async handleJoinEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { eventId: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = client.data.userId as string;
    const allowed = await this.chatService.canAccessChat(data.eventId, userId);
    if (!allowed) {
      client.emit('error', 'Bu sohbete erişim yetkin yok');
      return;
    }
    await client.join(data.eventId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { eventId: string; content: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = client.data.userId as string;
    const allowed = await this.chatService.canAccessChat(data.eventId, userId);
    if (!allowed) {
      client.emit('error', 'Bu sohbete erişim yetkin yok');
      return;
    }
    const message = await this.chatService.saveMessage(
      data.eventId,
      userId,
      data.content,
    );

    this.server.to(data.eventId).emit('newMessage', message);
  }
}
