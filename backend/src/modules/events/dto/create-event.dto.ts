import {
  IsString,
  IsOptional,
  IsInt,
  IsLatitude,
  IsLongitude,
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

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsString()
  placeId!: string;

  @IsString()
  categoryId!: string;

  @IsEnum(JoiningMode)
  joiningMode!: JoiningMode;

  @IsBoolean()
  isPaid!: boolean;
}
