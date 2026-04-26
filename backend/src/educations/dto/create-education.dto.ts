import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  image_url?: string;
}
