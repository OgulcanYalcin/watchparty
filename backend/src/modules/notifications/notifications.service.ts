import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createNotification(userId: string, text: string, eventId?: string) {
    return this.prismaService.notification.create({
      data: { userId, text, eventId },
    });
  }

  async getMyNotifications(userId: string) {
    return this.prismaService.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { id: true, title: true } } },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const record = await this.prismaService.notification.findUnique({
      where: { id: notificationId },
    });
    if (!record) {
      throw new NotFoundException('Kayıt bulunamadı');
    } else if (record.userId !== userId) {
      throw new ForbiddenException('Başkasının bildirimini okundu yapamazsın');
    } else {
      return this.prismaService.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    }
  }
}
