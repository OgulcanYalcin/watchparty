import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ParticipationService } from '../participation/participation.service';
import { ChatService } from '../chat/chat.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-events.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly participationService: ParticipationService,
    private readonly chatService: ChatService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateEventDto, @Req() req: Request) {
    return this.eventsService.createEvent(
      dto,
      req.user as { userId: string; email: string },
    );
  }
  @Get()
  findAll(@Query() filters: FilterEventDto) {
    return this.eventsService.findAll(filters);
  }

  @Get('categories')
  getCategories() {
    return this.eventsService.getCategories();
  }

  @Get('search-media')
  @UseGuards(AuthGuard('jwt'))
  searchMedia(@Query('query') query: string) {
    return this.eventsService.searchMedia(query);
  }

  @Get('search-sports')
  @UseGuards(AuthGuard('jwt'))
  searchSports(@Query('query') query: string) {
    return this.eventsService.searchSports(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post(':eventId/participate')
  @UseGuards(AuthGuard('jwt'))
  participate(@Param('eventId') eventId: string, @Req() req: Request) {
    return this.participationService.requestToJoin(
      eventId,
      (req.user as { userId: string; email: string }).userId,
    );
  }

  @Get(':id/messages')
  @UseGuards(AuthGuard('jwt'))
  messages(@Param('id') eventId: string, @Req() req: Request) {
    return this.chatService.getMessages(
      eventId,
      (req.user as { userId: string; email: string }).userId,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateEvent(
    @Param('id') eventId: string,
    @Body() dto: UpdateEventDto,
    @Req() req: Request,
  ) {
    return this.eventsService.updateEvent(
      eventId,
      (req.user as { userId: string; email: string }).userId,
      dto,
    );
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  cancel(@Param('id') eventId: string, @Req() req: Request) {
    return this.eventsService.cancelEvent(
      eventId,
      (req.user as { userId: string; email: string }).userId,
    );
  }

  @Get(':id/participants')
  @UseGuards(AuthGuard('jwt'))
  participants(@Param('id') eventId: string, @Req() req: Request) {
    return this.participationService.getParticipantsForEvent(
      eventId,
      (req.user as { userId: string; email: string }).userId,
    );
  }
}
