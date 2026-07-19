import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { TrustService } from './trust.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('trust')
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @Post('reviews')
  @UseGuards(AuthGuard('jwt'))
  reviews(@Body() dto: CreateReviewDto, @Req() req: Request) {
    return this.trustService.createReview(
      dto,
      (req.user as { userId: string; email: string }).userId,
    );
  }

  @Post(':id/block')
  @UseGuards(AuthGuard('jwt'))
  block(@Param('id') id: string, @Req() req: Request) {
    return this.trustService.blockUser(
      (req.user as { userId: string; email: string }).userId,
      id,
    );
  }

  @Post('reports')
  @UseGuards(AuthGuard('jwt'))
  reports(@Body() dto: CreateReportDto, @Req() req: Request) {
    return this.trustService.createReport(
      dto,
      (req.user as { userId: string; email: string }).userId,
    );
  }
}
