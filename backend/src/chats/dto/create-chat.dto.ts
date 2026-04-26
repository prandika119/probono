import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsUUID()
  @IsNotEmpty()
  caseId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
