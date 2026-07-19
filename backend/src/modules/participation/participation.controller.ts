import {
  Controller,
  Param,
  Patch,
  Req,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestStatus } from '@prisma/client';
import type { Request } from 'express';
import { ParticipationService } from './participation.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Controller('participations')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  approve(@Param('id') id: string, @Req() req: Request) {
    return this.participationService.updateStatus(
      id,
      (req.user as { userId: string; email: string }).userId,
      RequestStatus.APPROVED,
    );
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard('jwt'))
  reject(@Param('id') id: string, @Req() req: Request) {
    return this.participationService.updateStatus(
      id,
      (req.user as { userId: string; email: string }).userId,
      RequestStatus.REJECTED,
    );
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  cancel(@Param('id') id: string, @Req() req: Request) {
    return this.participationService.cancelParticipation(
      id,
      (req.user as { userId: string; email: string }).userId,
    );
  }

  @Patch(':id/attendance')
  @UseGuards(AuthGuard('jwt'))
  attendance(
    @Param('id') id: string,
    @Body() dto: MarkAttendanceDto,
    @Req() req: Request,
  ) {
    return this.participationService.markAttendance(
      id,
      (
        req.user as {
          userId: string;
          email: string;
        }
      ).userId,
      dto.attended,
    );
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  myParticipations(@Req() req: Request) {
    return this.participationService.getMyParticipations(
      (req.user as { userId: string; email: string }).userId,
    );
  }
}
