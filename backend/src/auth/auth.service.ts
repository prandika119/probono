import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/prisma/generated/client/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone_number: dto.phone_number }, { nik: dto.nik }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with that email, phone, or nik already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const checkRole = dto.role as Role;

    return this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          phone_number: dto.phone_number,
          password: hashedPassword,
          name: dto.name,
          nik: dto.nik,
          address: dto.address,
          province: dto.province,
          city: dto.city,
          role: checkRole,
          is_active: true,
        },
      });

      if (checkRole === Role.CLIENT) {
        await tx.client.create({
          data: {
            user_id: newUser.id,
            sktm_upload: dto.sktm_upload,
          },
        });
      } else if (checkRole === Role.LAWYER) {
        await tx.lawyer.create({
          data: {
            user_id: newUser.id,
            license_number: dto.license_number!,
            license_upload: dto.license_upload,
            organization_name: dto.organization_name,
            office_address: dto.office_address,
            experience: dto.experience,
            speciality: dto.speciality,
          },
        });
      }

      const { password, ...result } = newUser;
      
      return {
        message: 'User registered successfully. Pending verification.',
        data: { user: result },
      };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // if (!user.is_active && user.verification_status !== 'VERIFIED') {
    //   throw new UnauthorizedException('Please wait for account verification');
    // }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    const { password, ...result } = user;

    return {
      message: 'Login successful',
      data: {
        access_token: this.jwtService.sign(payload),
        token_type: 'Bearer',
        expires_in: 86400, // 1 day
        user: result,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true,
        lawyer: true,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const { password, ...result } = user;
    
    let detail = {};
    if (result.role === Role.CLIENT && result.client) {
      detail = { client_detail: result.client };
    } else if (result.role === Role.LAWYER && result.lawyer) {
      detail = { lawyer_detail: result.lawyer };
    }

    const { client, lawyer, ...baseUser } = result;

    return {
      data: {
        user: { ...baseUser, ...detail }
      }
    };
  }
}
