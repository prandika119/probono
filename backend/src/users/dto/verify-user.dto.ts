import { IsEnum, IsBoolean, IsString, IsOptional } from 'class-validator';
import { VerificationStatus } from 'src/prisma/generated/client/enums';

export class VerifyUserDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsString()
  rejection_reason?: string;
}
