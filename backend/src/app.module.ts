import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { EventsModule } from './modules/events/events.module';
import { ParticipationModule } from './modules/participation/participation.module';
import { TrustModule } from './modules/trust/trust.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    EventsModule,
    ParticipationModule,
    TrustModule,
    ChatModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
