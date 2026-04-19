import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CategoryType } from 'src/prisma/generated/client/enums';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;
}
