import { Module } from '@nestjs/common';
import { ParticipationController } from './participation.controller';
import { ParticipationService } from './participation.service';
import { TrustModule } from '../trust/trust.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TrustModule, NotificationsModule],
  controllers: [ParticipationController],
  providers: [ParticipationService],
  exports: [ParticipationService],
})
export class ParticipationModule {}
