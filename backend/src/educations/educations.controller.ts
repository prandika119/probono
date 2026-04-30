import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../prisma/generated/client/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const dest = './uploads/public/educations';
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

@Controller('educations')
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('cover_image', uploadOptions))
  create(
    @Body() createEducationDto: CreateEducationDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      createEducationDto.image_url = `/uploads/public/educations/${file.filename}`;
    }
    return this.educationsService.create(createEducationDto, req.user.id);
  }

  @Get()
  // Public route: No guards needed
  findAll(@Query() query) {
    return this.educationsService.findAll(query);
  }

  @Get(':id')
  // Public route: No guards needed
  findOne(@Param('id') id: string) {
    return this.educationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('cover_image', uploadOptions))
  update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      updateEducationDto.image_url = `/uploads/public/educations/${file.filename}`;
    }
    return this.educationsService.update(id, updateEducationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.educationsService.remove(id);
  }
}
