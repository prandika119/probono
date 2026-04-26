import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { Role } from 'src/prisma/generated/client/enums';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: string, verification_status?: string, is_active?: boolean, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const whereClause: any = {};
    if (role) whereClause.role = role.toUpperCase();
    if (verification_status) whereClause.verification_status = verification_status.toUpperCase();
    if (is_active != null) whereClause.is_active = is_active;
    
    const [users, total_items] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verification_status: true,
          is_active: true,
        },
      }),
      this.prisma.user.count({ where: whereClause }),
    ]);

    return {
      data: { users },
      meta: {
        current_page: page,
        total_pages: Math.ceil(total_items / limit),
        total_items,
      },
    };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });

    return { message: 'User profile updated successfully' };
  }

  async uploadKtp(userId: string, fileUrl: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { ktp_image: fileUrl },
    });
    return { message: 'KTP uploaded successfully', data: { url: fileUrl } };
  }

  async uploadSktm(userId: string, fileUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== Role.CLIENT) throw new BadRequestException('Only client can upload SKTM');

    await this.prisma.client.update({
      where: { user_id: userId },
      data: { sktm_upload: fileUrl },
    });
    return { message: 'SKTM uploaded successfully', data: { url: fileUrl } };
  }

  async uploadLicense(userId: string, fileUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== Role.LAWYER) throw new BadRequestException('Only lawyer can upload License');

    await this.prisma.lawyer.update({
      where: { user_id: userId },
      data: { license_upload: fileUrl },
    });
    return { message: 'License uploaded successfully', data: { url: fileUrl } };
  }

  async verifyUser(userId: string, verifyUserDto: VerifyUserDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verification_status: verifyUserDto.status,
        is_active: verifyUserDto.is_active,
      },
    });
    return { message: 'User verification status updated successfully' };
  }

  async softDelete(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { is_active: false },
    });
    return { message: 'User account deactivated/deleted successfully' };
  }
}

