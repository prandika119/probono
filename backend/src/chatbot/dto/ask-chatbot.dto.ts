import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AskChatbotDto {
  @IsString()
  @IsNotEmpty({ message: 'Pertanyaan tidak boleh kosong.' })
  @MaxLength(2000, { message: 'Pertanyaan terlalu panjang (maksimal 2000 karakter).' })
  question: string;
}

export class CreateSessionDto {
  @IsString()
  title?: string;
}
