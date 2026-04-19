import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { CaseStatus } from 'src/prisma/generated/client/enums';

export class CreateProgressDto {
  @IsEnum(CaseStatus)
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  note?: string;
}
