import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsOptional()
  @IsString()
  reportedUserId?: string;

  @IsOptional()
  @IsString()
  reportedEventId?: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
