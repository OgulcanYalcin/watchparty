import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsIn(['light', 'dark'])
  @IsOptional()
  theme?: string;
}
