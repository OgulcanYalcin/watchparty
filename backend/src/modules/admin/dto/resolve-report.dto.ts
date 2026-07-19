import { IsEnum } from 'class-validator';
import { Result } from '@prisma/client';

export class ResolveReportDto {
  @IsEnum(Result)
  resolution!: Result;
}
