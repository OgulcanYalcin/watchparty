import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RequestStatus } from '@prisma/client';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class TrustService {
  constructor(private readonly prismaService: PrismaService) {}

  async createReview(dto: CreateReviewDto, senderId: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id: dto.eventId },
    });
    if (!event) {
      throw new NotFoundException('Etkinlik Bulunamadı');
    }
    if (event.date > new Date()) {
      throw new ForbiddenException('Etkinlik Henüz Bitmedi');
    }
    if (senderId === dto.receiverId) {
      throw new ForbiddenException('Kendinizi Değerlendiremezsiniz');
    }
    const senderOk = await this.wasParticipant(dto.eventId, senderId, event);
    if (!senderOk) {
      throw new ForbiddenException('Bu etkinlikte yer alamadın');
    }

    const receiverOk = await this.wasParticipant(
      dto.eventId,
      dto.receiverId,
      event,
    );
    if (!receiverOk) {
      throw new ForbiddenException(
        'Değerlendirdiğin kişi bu etkinlikte yer almamış',
      );
    }

    const review = await this.prismaService.review.create({
      data: {
        senderUserId: senderId,
        receiverUserId: dto.receiverId,
        eventId: dto.eventId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
    await this.recalculateReputation(dto.receiverId);

    return review;
  }

  private async wasParticipant(
    eventId: string,
    userId: string,
    event: { createdById: string },
  ): Promise<boolean> {
    if (event.createdById === userId) {
      return true;
    }
    const participation = await this.prismaService.eventParticipation.findFirst(
      {
        where: { eventId, userId, requestStatus: RequestStatus.APPROVED },
      },
    );
    return !!participation;
  }

  async recalculateReputation(userId: string) {
    const average = await this.prismaService.review.aggregate({
      where: { receiverUserId: userId },
      _avg: { rating: true },
    });

    return this.prismaService.user.update({
      where: { id: userId },
      data: { reputationScore: average._avg.rating ?? 0 },
    });
  }

  async blockUser(hostId: string, blockedUserId: string) {
    if (hostId === blockedUserId) {
      throw new ForbiddenException('Kendini engelleyemezsin');
    }
    return this.prismaService.hostBlock.create({
      data: { hostId, blockedUserId },
    });
  }

  async createReport(dto: CreateReportDto, reporterId: string) {
    if (dto.reportedUserId == null && dto.reportedEventId == null) {
      throw new BadRequestException('Senin gönderdiğin veri kurallara uymuyor');
    } else if (dto.reportedUserId != null && dto.reportedEventId != null) {
      throw new BadRequestException('Senin gönderdiğin veri kurallara uymuyor');
    }
    return this.prismaService.report.create({
      data: {
        reporterId,
        reportedUserId: dto.reportedUserId,
        reportedEventId: dto.reportedEventId,
        reason: dto.reason,
      },
    });
  }
}
