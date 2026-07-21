import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, RequestStatus } from '@prisma/client';
import { FilterEventDto } from './dto/filter-events.dto';

interface TmdbSearchResult {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  poster_path: string | null;
}

interface TmdbSearchResponse {
  results: TmdbSearchResult[];
}

interface TheSportsDbTeam {
  idTeam: string;
  strTeam: string;
  strBadge: string | null;
  strFanart1: string | null;
}

interface TheSportsDbResponse {
  teams: TheSportsDbTeam[] | null;
}
@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

  async createEvent(
    dto: CreateEventDto,
    user: { userId: string; email: string },
  ) {
    const event = await this.prismaService.event.create({
      data: {
        createdById: user.userId,
        title: dto.title,
        description: dto.description,
        date: dto.date,
        capacity: dto.capacity,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        placeId: dto.placeId,
        categoryId: dto.categoryId,
        joiningMode: dto.joiningMode,
        isPaid: dto.isPaid,
        imageUrl: dto.imageUrl,
      },
    });
    return event;
  }

  async findAll(filters?: FilterEventDto) {
    const where: Record<string, unknown> = {};
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      const endOfDay = new Date(filters.date);
      endOfDay.setDate(endOfDay.getDate() + 1);
      where.date = { gte: startOfDay, lt: endOfDay };
    }

    return this.prismaService.event.findMany({
      where,
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            reputationScore: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            reputationScore: true,
          },
        },
      },
    });
    if (event == null) {
      throw new NotFoundException('Etkinlik Bulunamadı');
    }
    return event;
  }

  async updateEvent(eventId: string, hostId: string, dto: UpdateEventDto) {
    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Etkinlik bulunamadı');
    } else if (event.createdById !== hostId) {
      throw new ForbiddenException('Bu etkinliğe erişme hakkınız yok');
    } else if (event.status === EventStatus.CANCELLED) {
      throw new ConflictException('Etkinlik iptal edilmiş');
    } else {
      const result = await this.prismaService.event.update({
        where: { id: eventId },
        data: { ...dto },
      });

      const participants = await this.prismaService.eventParticipation.findMany(
        {
          where: { eventId, requestStatus: RequestStatus.APPROVED },
        },
      );
      for (const participant of participants) {
        await this.notificationService.createNotification(
          participant.userId,
          'Katıldığın bir etkinlik güncellendi',
          eventId,
        );
      }
      return result;
    }
  }

  async cancelEvent(eventId: string, hostId: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Etkinlik Bulunamadı');
    } else if (event.createdById !== hostId) {
      throw new ForbiddenException('Bu etkinliğe erişme hakkınız yok');
    } else if (event.status === EventStatus.CANCELLED) {
      throw new ConflictException('Etkinlik iptal edilmiş');
    } else {
      const result = await this.prismaService.event.update({
        where: { id: eventId },
        data: { status: EventStatus.CANCELLED },
      });
      const participants = await this.prismaService.eventParticipation.findMany(
        {
          where: { eventId, requestStatus: RequestStatus.APPROVED },
        },
      );
      for (const participant of participants) {
        await this.notificationService.createNotification(
          participant.userId,
          'Katıldığın bir etkinlik iptal edildi',
          eventId,
        );
      }
      return result;
    }
  }
  async getCategories() {
    return this.prismaService.interest.findMany();
  }

  async searchMedia(query: string) {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=tr-TR`;
    const response = await fetch(url);
    const data = (await response.json()) as TmdbSearchResponse;

    return data.results
      .filter(
        (item: { media_type: string }) =>
          item.media_type === 'movie' || item.media_type === 'tv',
      )
      .map(
        (item: {
          id: number;
          title?: string;
          name?: string;
          poster_path: string | null;
        }) => ({
          id: item.id,
          title: item.title ?? item.name,
          posterUrl: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : null,
        }),
      );
  }

  async searchSports(query: string) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = (await response.json()) as TheSportsDbResponse;

    if (!data.teams) return [];

    return data.teams.map((team) => ({
      id: Number(team.idTeam),
      title: team.strTeam,
      posterUrl: team.strFanart1 ?? team.strBadge ?? null,
    }));
  }
}
