import { Injectable, NotFoundException } from '@nestjs/common';
import { Result, UserStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllReports() {
    return this.prismaService.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  async resolveReport(reportId: string, resolution: Result) {
    const record = await this.prismaService.report.findUnique({
      where: { id: reportId },
    });
    if (!record) {
      throw new NotFoundException('Kayıt Bulunamadı');
    }
    return await this.prismaService.report.update({
      where: { id: reportId },
      data: { resolved: resolution },
    });
  }

  async suspendUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Kullanıcı Bulunamadı');
    }
    const updated = await this.prismaService.user.update({
      where: { id: userId },
      data: { status: UserStatus.SUSPENDED },
    });
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  async banUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Kullanıcı Bulunamadı');
    }
    const updated = await this.prismaService.user.update({
      where: { id: userId },
      data: { status: UserStatus.BANNED },
    });
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  async getStats() {
    const count = await this.prismaService.user.count({
      where: { status: UserStatus.ACTIVE },
    });
    const totalCount = await this.prismaService.event.count();
    const categoryGroups = await this.prismaService.event.groupBy({
      by: ['categoryId'],
      _count: true,
    });
    const totalMarked = await this.prismaService.eventParticipation.count({
      where: { attended: { not: null } },
    });
    const attendedCount = await this.prismaService.eventParticipation.count({
      where: { attended: true },
    });
    const attendanceRate =
      totalMarked > 0 ? (attendedCount / totalMarked) * 100 : 0;

    return {
      activeUsers: count,
      totalEvents: totalCount,
      categoryDistribution: categoryGroups,
      attendanceRate: Math.round(attendanceRate),
    };
  }
}
