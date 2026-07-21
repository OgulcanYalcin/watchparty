import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JoiningMode, Prisma, RequestStatus } from '@prisma/client';
import { TrustService } from '../trust/trust.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ParticipationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly trustService: TrustService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async requestToJoin(eventId: string, userId: string) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Event" WHERE id = ${eventId} FOR UPDATE`;

        const event = await tx.event.findUnique({
          where: { id: eventId },
        });
        if (!event) {
          throw new NotFoundException('Etkinlik Bulunamadı');
        }

        const approvedCount = await tx.eventParticipation.count({
          where: { eventId, requestStatus: RequestStatus.APPROVED },
        });

        const blocked = await tx.hostBlock.findUnique({
          where: {
            hostId_blockedUserId: {
              hostId: event.createdById,
              blockedUserId: userId,
            },
          },
        });
        if (blocked) {
          throw new ForbiddenException('Bu host tarafından engellendin');
        }

        let status: RequestStatus;
        if (approvedCount >= event.capacity) {
          status = RequestStatus.REJECTED;
        } else {
          if (event.joiningMode === JoiningMode.AUTOMATIC) {
            status = RequestStatus.APPROVED;
          } else {
            status = RequestStatus.PENDING;
          }
        }

        return tx.eventParticipation.create({
          data: {
            userId,
            eventId,
            requestStatus: status,
          },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Bu etkinliğe zaten katılım isteği gönderdin',
        );
      }
      throw error;
    }
  }

  async updateStatus(
    participationId: string,
    hostUserId: string,
    newStatus: RequestStatus,
  ) {
    const updated = await this.prismaService.$transaction(async (tx) => {
      const record = await tx.eventParticipation.findUnique({
        where: { id: participationId },
        include: { event: true },
      });
      if (!record) {
        throw new NotFoundException('Katılım Kaydı Bulunamadı');
      }
      if (record.event.createdById !== hostUserId) {
        throw new ForbiddenException('Bu etkinliğin hostu değilsin');
      }

      if (newStatus === RequestStatus.APPROVED) {
        await tx.$queryRaw`SELECT * FROM "Event" WHERE id = ${record.eventId} FOR UPDATE`;

        const approvedCount = await tx.eventParticipation.count({
          where: {
            eventId: record.eventId,
            requestStatus: RequestStatus.APPROVED,
          },
        });

        if (approvedCount >= record.event.capacity) {
          throw new ConflictException('Etkinlik Kapasitesi Dolu');
        }
      }

      return tx.eventParticipation.update({
        where: { id: participationId },
        data: { requestStatus: newStatus },
      });
    });

    const message =
      newStatus === RequestStatus.APPROVED
        ? 'Katılım isteğin onaylandı'
        : 'Katılım isteğin reddedildi';
    await this.notificationsService.createNotification(
      updated.userId,
      message,
      updated.eventId,
    );

    return updated;
  }

  async cancelParticipation(participationId: string, userId: string) {
    const record = await this.prismaService.eventParticipation.findUnique({
      where: { id: participationId },
    });
    if (!record) {
      throw new NotFoundException('Katılım Kaydı Bulunamadı');
    } else if (record.userId !== userId) {
      throw new ForbiddenException('Bu senin katılım kaydın değil');
    }

    if (
      record.requestStatus !== RequestStatus.PENDING &&
      record.requestStatus !== RequestStatus.APPROVED
    ) {
      throw new ConflictException(
        'Bu istek zaten iptal edilmiş veya reddedilmiş',
      );
    }

    return this.prismaService.eventParticipation.update({
      where: { id: participationId },
      data: { requestStatus: RequestStatus.CANCELLED },
    });
  }

  async markAttendance(
    participationId: string,
    hostUserId: string,
    attended: boolean,
  ) {
    const record = await this.prismaService.eventParticipation.findUnique({
      where: { id: participationId },
      include: { event: true },
    });
    if (!record) {
      throw new NotFoundException('Katılım Kaydı Bulunamadı');
    }
    if (record.event.createdById !== hostUserId) {
      throw new ForbiddenException('Bu etkinliğin hostu değilsin');
    }
    if (record.requestStatus !== RequestStatus.APPROVED) {
      throw new ConflictException(
        'Sadece onaylanmış katılımcılar işaretlenebilir',
      );
    }
    if (record.event.date > new Date()) {
      throw new ForbiddenException('Etkinlik Henüz Bitmedi');
    }
    const updated = await this.prismaService.eventParticipation.update({
      where: { id: participationId },
      data: { attended },
    });

    await this.trustService.recalculateReputation(record.userId);

    return updated;
  }

  async getParticipantsForEvent(eventId: string, hostUserId: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Etkinlik Bulunamadı');
    }
    if (event.createdById !== hostUserId) {
      throw new ForbiddenException('Bu etkinliğin hostu değilsin');
    }

    return this.prismaService.eventParticipation.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            reputationScore: true,
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async getMyParticipations(userId: string) {
    return this.prismaService.eventParticipation.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            address: true,
            status: true,
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }
}
