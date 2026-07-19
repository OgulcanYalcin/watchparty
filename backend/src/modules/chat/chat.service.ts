import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canAccessChat(eventId: string, userId: string): Promise<boolean> {
    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return false;
    } else if (event.createdById === userId) {
      return true;
    } else {
      const record = await this.prismaService.eventParticipation.findFirst({
        where: { eventId, userId, requestStatus: RequestStatus.APPROVED },
      });
      if (!record) {
        return false;
      } else {
        return true;
      }
    }
  }

  async saveMessage(eventId: string, userId: string, content: string) {
    return this.prismaService.message.create({
      data: { eventId, userId, content },
      include: {
        user: { select: { id: true, name: true, profilePicture: true } },
      },
    });
  }

  async getMessages(eventId: string, userId: string) {
    const allowed = await this.canAccessChat(eventId, userId);
    if (!allowed) {
      throw new ForbiddenException('Bu sohbeti görüntülemeye iznin yok');
    }
    return this.prismaService.message.findMany({
      where: { eventId },
      orderBy: { sentAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, profilePicture: true } },
      },
    });
  }
}
