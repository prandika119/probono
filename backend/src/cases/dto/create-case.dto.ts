import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  opponent?: string;

  @IsNumber()
  @IsOptional()
  estimated_loss?: number;

  @IsString()
  @IsOptional()
  legal_goal?: string;

  @IsString()
  @IsOptional()
  urgency?: string;
}
