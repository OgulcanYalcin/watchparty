import { Controller, Get, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request) {
    return this.notificationsService.getMyNotifications(
      (req.user as { userId: string; email: string }).userId,
    );
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard('jwt'))
  markAsRead(@Param('id') id: string, @Req() req: Request) {
    return this.notificationsService.markAsRead(
      id,
      (req.user as { userId: string; email: string }).userId,
    );
  }
}
