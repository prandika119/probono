import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, IsEnum, ValidateIf, MaxLength } from 'class-validator';
// import { Role, Speciality } from '@prisma/client';
import { Role, Speciality } from 'src/prisma/generated/client/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  nik: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsEnum(Role)
  role: Role;

  // --- Role 'ADMIN' specific? Usually admins are not registered via public endpoint or skip specific fields. 
  // But let's follow the standard.

  // --- Role 'CLIENT' specific
  @ValidateIf(o => o.role === Role.CLIENT)
  @IsOptional() // sktm bisa diupload belakangan
  @IsString()
  sktm_upload?: string;

  // --- Role 'LAWYER' specific
  @ValidateIf(o => o.role === Role.LAWYER)
  @IsNotEmpty()
  @IsString()
  license_number?: string;

  @ValidateIf(o => o.role === Role.LAWYER)
  @IsOptional()
  @IsString()
  license_upload?: string;

  @ValidateIf(o => o.role === Role.LAWYER)
  @IsNotEmpty()
  @IsString()
  organization_name?: string;

  @ValidateIf(o => o.role === Role.LAWYER)
  @IsNotEmpty()
  @IsString()
  office_address?: string;

  @ValidateIf(o => o.role === Role.LAWYER)
  @IsNotEmpty()
  @IsString()
  experience?: string;

  @ValidateIf(o => o.role === Role.LAWYER)
  @IsEnum(Speciality)
  speciality?: Speciality;
}

export class LoginDto {
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
}
