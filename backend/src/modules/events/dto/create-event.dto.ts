import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { JoiningMode } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsInt()
  capacity!: number;

  @IsString()
  address!: string;

  @IsString()
  categoryId!: string;

  @IsEnum(JoiningMode)
  joiningMode!: JoiningMode;

  @IsBoolean()
  isPaid!: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
