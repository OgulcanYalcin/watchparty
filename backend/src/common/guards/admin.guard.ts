import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request.user as { userId: string }).userId;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bu işlem için admin yetkisi gerekiyor');
    }

    return true;
  }
}
