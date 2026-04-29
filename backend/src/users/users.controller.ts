import { 
  Controller, Get, Put, Post, Patch, Delete, Body, Param, Query, 
  UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Role } from 'src/prisma/generated/client/enums';

const uploadOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll(
    @Query('role') role?: string,
    @Query('verification_status') verificationStatus?: string,
    @Query('is_active') isActive?: boolean,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.usersService.findAll(role, verificationStatus, isActive, +page, +limit);
  }

  @Put(':userId')
  async updateProfile(@Request() req, @Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    if (req.user.id !== userId) {
      throw new BadRequestException('You are not allowed to update this profile');
    }
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Post(':userId/upload-ktp')
  @UseInterceptors(FileInterceptor('ktp_image', uploadOptions))
  async uploadKtp(@Request() req, @Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new BadRequestException('You are not allowed to upload for this user');
    }
    if (!file) throw new BadRequestException('File is required');
    const fileUrl = `/uploads/${file.filename}`;
    return this.usersService.uploadKtp(userId, fileUrl);
  }

  @Post(':userId/upload-profile')
  @UseInterceptors(FileInterceptor('profile_image', uploadOptions))
  async uploadProfileImage(@Request() req, @Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (req.user.id !== userId) {
      throw new BadRequestException('You are not allowed to upload for this user');
    }
    if (!file) throw new BadRequestException('File is required');
    const fileUrl = `/uploads/${file.filename}`;
    return this.usersService.uploadProfileImage(userId, fileUrl);
  }

  @Post(':userId/upload-sktm')
  @UseInterceptors(FileInterceptor('sktm_file', uploadOptions))
  async uploadSktm(@Request() req, @Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new BadRequestException('You are not allowed to upload for this user');
    }
    if (!file) throw new BadRequestException('File is required');
    const fileUrl = `/uploads/${file.filename}`;
    return this.usersService.uploadSktm(userId, fileUrl);
  }

  @Post(':userId/upload-license')
  @UseInterceptors(FileInterceptor('license_file', uploadOptions))
  async uploadLicense(@Request() req, @Param('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new BadRequestException('You are not allowed to upload for this user');
    }
    if (!file) throw new BadRequestException('File is required');
    const fileUrl = `/uploads/${file.filename}`;
    return this.usersService.uploadLicense(userId, fileUrl);
  }

  @Roles(Role.ADMIN)
  @Patch(':userId/verify')
  async verifyUser(@Param('userId') userId: string, @Body() verifyUserDto: VerifyUserDto) {
    return this.usersService.verifyUser(userId, verifyUserDto);
  }

  @Delete(':userId')
  async deleteUser(@Request() req, @Param('userId') userId: string) {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new BadRequestException('You are not allowed to delete this user');
    }
    return this.usersService.softDelete(userId);
  }
}

