import { IsString, IsNotEmpty, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  consultation_at: string;

  @IsBoolean()
  @IsOptional()
  is_online?: boolean;

  @IsString()
  @IsOptional()
  link_meet?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
