import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { CreateProgressDto } from './dto/create-progress.dto';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/prisma/generated/client/enums';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const dest = './uploads/private/cases';
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

@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @Roles(Role.CLIENT)
  async createCase(@Body() createCaseDto: CreateCaseDto, @Request() req) {
    // req.user has user.id after JWT verifies
    return this.casesService.create(createCaseDto, req.user.id);
  }

  @Get('me')
  async getMyCases(@Request() req, @Query() query) {
    return this.casesService.findMyCases(req.user.id, query);
  }

  @Get('available')
  async getAvailableCases(@Query() query) {
    return this.casesService.findAvailableCases(query);
  }

  @Get('handled')
  @Roles(Role.LAWYER)
  async getHandledCases(@Request() req, @Query() query) {
    return this.casesService.findHandledCases(req.user.id, query);
  }

  @Patch(':id/accept')
  @Roles(Role.LAWYER)
  async acceptCase(@Param('id') id: string, @Request() req) {
    return this.casesService.acceptCase(id, req.user.id);
  }

  @Get(':id')
  async getCaseDetail(@Param('id') id: string, @Request() req) {
    return this.casesService.findOne(id, req.user);
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('document_file', uploadOptions))
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return this.casesService.uploadDocument(id, file, req.user.id);
  }

  @Post(':id/progress')
  async addProgress(@Param('id') id: string, @Body() dto: CreateProgressDto, @Request() req) {
    return this.casesService.addProgress(id, dto, req.user.id);
  }

  @Post(':id/consultations')
  async addConsultation(@Param('id') id: string, @Body() dto: CreateConsultationDto, @Request() req) {
    return this.casesService.addConsultation(id, dto, req.user.id);
  }

  @Post(':id/reviews')
  @Roles(Role.CLIENT)
  async addReview(@Param('id') id: string, @Body() dto: CreateReviewDto, @Request() req) {
    return this.casesService.addReview(id, dto, req.user.id);
  }
}
