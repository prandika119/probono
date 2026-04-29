import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { CreateProgressDto } from './dto/create-progress.dto';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { CaseStatus, Urgency } from 'src/prisma/generated/client/enums';
import { User } from 'src/prisma/generated/client/client';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCaseDto, userId: string) {
    // Cari client berdasarkan userId
    const client = await this.prisma.client.findUnique({ where: { user_id: userId } });
    if (!client) throw new UnauthorizedException('Only clients can create cases');

    const newCase = await this.prisma.case.create({
      data: {
        client_id: client.id,
        category_id: dto.category_id,
        title: dto.title,
        description: dto.description,
        location: dto.location,
        date: dto.date ? new Date(dto.date) : null,
        opponent: dto.opponent,
        estimated_loss: dto.estimated_loss,
        legal_goal: dto.legal_goal,
        urgency: dto.urgency as Urgency || Urgency.LOW,
        documents: {}, // TODO logic file attachment
      },
      include: { category: true }
    });

    // Buat initial progress log
    await this.prisma.caseProgress.create({
      data: {
        case_id: newCase.id,
        status: CaseStatus.SUBMITTED,
        note: 'Kasus diajukan oleh klien',
      }
    });

    return {
      status: 'success',
      message: 'Case submitted successfully',
      data: {
        case: {
          id: newCase.id,
          status: CaseStatus.SUBMITTED,
          created_at: newCase.created_at,
        }
      }
    };
  }

  async findMyCases(userId: string, query: any = {}) {
    const { page = 1, limit = 10 } = query;
    const client = await this.prisma.client.findUnique({ where: { user_id: userId } });
    if (!client) throw new UnauthorizedException('Not a client');

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where: { client_id: client.id },
        include: { lawyer:true, category: true, progress: { orderBy: { created_at: 'desc' }, take: 1 } },
        orderBy: { created_at: 'desc' },
        take,
        skip,
      }),
      this.prisma.case.count({ where: { client_id: client.id } })
    ]);

    return {
      status: 'success',
      data: {
        cases: cases.map(c => ({
          id: c.id,
          title: c.title,
          category_name: c.category.name,
          lawyer: c.lawyer,
          status: c.progress.length > 0 ? c.progress[0].status : CaseStatus.SUBMITTED,
          created_at: c.created_at,
        })),
        meta: {
          total_items: total,
          current_page: Number(page),
          total_pages: Math.ceil(total / take),
          per_page: take,
        }
      }
    };
  }

  async findAvailableCases(query: any) {
    const { category_id, urgency, location, page = 1, limit = 10 } = query;
    const where: any = { lawyer_id: null };
    if (category_id) where.category_id = category_id;
    if (urgency) where.urgency = urgency.toUpperCase() as Urgency;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        include: { category: true },
        orderBy: { created_at: 'desc' },
        take,
        skip,
      }),
      this.prisma.case.count({ where }),
    ]);

    return {
      status: 'success',
      data: {
        cases: cases.map(c => ({
          id: c.id,
          title: c.title,
          category_name: c.category.name,
          location: c.location,
          urgency: c.urgency,
          created_at: c.created_at,
        })),
        meta: {
          total_items: total,
          current_page: Number(page),
          total_pages: Math.ceil(total / take),
          per_page: take,
        }
      }
    }
  }

  async findHandledCases(userId: string, query: any = {}) {
    const { page = 1, limit = 10 } = query;
    const lawyer = await this.prisma.lawyer.findUnique({ where: { user_id: userId } });
    if (!lawyer) throw new UnauthorizedException('Not a lawyer');

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where: { lawyer_id: lawyer.id },
        include: { client: { include: { user: true } }, progress: { orderBy: { created_at: 'desc' }, take: 1 } },
        orderBy: { updated_at: 'desc' },
        take,
        skip,
      }),
      this.prisma.case.count({ where: { lawyer_id: lawyer.id } })
    ]);

    return {
      status: 'success',
      data: {
        cases: cases.map(c => ({
          id: c.id,
          title: c.title,
          client_name: c.client.user.name,
          status: c.progress.length > 0 ? c.progress[0].status : CaseStatus.ACCEPTED,
          last_update: c.updated_at,
        })),
        meta: {
          total_items: total,
          current_page: Number(page),
          total_pages: Math.ceil(total / take),
          per_page: take,
        }
      }
    };
  }

  async acceptCase(caseId: string, userId: string) {
    const lawyer = await this.prisma.lawyer.findUnique({ where: { user_id: userId } });
    if (!lawyer) throw new UnauthorizedException('Not a lawyer');

    const targetCase = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!targetCase) throw new NotFoundException('Case not found');
    if (targetCase.lawyer_id) throw new BadRequestException('Case already handled by another lawyer');

    await this.prisma.case.update({
      where: { id: caseId },
      data: { lawyer_id: lawyer.id }
    });

    await this.prisma.caseProgress.create({
      data: {
        case_id: caseId,
        status: CaseStatus.ACCEPTED,
        note: 'Kasus diterima oleh advokat dan siap ditindaklanjuti',
      }
    });

    return {
      status: 'success',
      message: 'Case accepted successfully. You are now assigned to this case.'
    };
  }

  async findOne(caseId: string, user: User) {
    const c = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: {
        client: { include: { user: true } },
        lawyer: { include: { user: true } },
        category: true,
        documents: true,
        progress: { orderBy: { created_at: 'asc' } },
        consultations: true,
      }
    });

    if (!c) throw new NotFoundException('Case not found');
    if (user.role === 'CLIENT' && c.client.user.id !== user.id) {
      throw new ForbiddenException('Anda tidak berhak melihat kasus ini');
    }
  
    // if (user.role === 'LAWYER' && c.lawyer?.user?.id !== user.id) {
    //   throw new ForbiddenException('Kasus ini tidak sedang Anda tangani');
    // }

    const latestStatus = c.progress.length > 0 ? c.progress[c.progress.length - 1].status : CaseStatus.SUBMITTED;

    return {
      status: 'success',
      data: {
        case: {
          id: c.id,
          title: c.title,
          location: c.location,
          legal_goal: c.legal_goal,
          description: c.description,
          client: { id: c.client.id, name: c.client.user.name, phone_number: c.client.user.phone_number },
          lawyer: c.lawyer ? { id: c.lawyer.id, name: c.lawyer.user.name, organization_name: c.lawyer.organization_name } : null,
          category: { name: c.category.name },
          urgency: c.urgency,
          status: latestStatus,
          documents: c.documents,
          progress: c.progress,
          consultations: c.consultations,
        }
      }
    };
  }

  async uploadDocument(caseId: string, file: Express.Multer.File, userId: string) {
    if (!file) throw new BadRequestException('No file uploaded');
    const targetCase = await this.prisma.case.findUnique({ where: { id: caseId }, include: {
      client: { include: { user: true } },
      lawyer: { include: { user: true } },
    } });

    if (!targetCase) throw new NotFoundException('Case not found');
    if (targetCase.client.user.id !== userId && targetCase.lawyer?.user?.id !== userId) {
      throw new ForbiddenException('Anda tidak berhak mengunggah dokumen ini');
    }

    const fileUrl = `/uploads/cases/${file.filename || file.originalname}`;

    const doc = await this.prisma.caseDocument.create({
      data: {
        case_id: caseId,
        filename: file.originalname,
        file_url: fileUrl,
      }
    });

    return {
      status: 'success',
      message: 'Document uploaded successfully',
      data: { document: doc }
    };
  }

  async addProgress(caseId: string, dto: CreateProgressDto, userId: string) {
    const targetCase = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { lawyer: { include: { user: true } } }
    });

    if (!targetCase) throw new NotFoundException('Case not found');
    if (targetCase.lawyer?.user?.id !== userId) {
      throw new ForbiddenException('Anda tidak berhak menambahkan progress pada kasus ini');
    }

    const progress = await this.prisma.caseProgress.create({
      data: {
        case_id: caseId,
        status: dto.status as CaseStatus,
        note: dto.note,
      }
    });

    return {
      status: 'success',
      message: 'Case progress updated successfully',
      data: { progress }
    };
  }

  async addConsultation(caseId: string, dto: CreateConsultationDto, userId: string) {
    const targetCase = await this.prisma.case.findUnique({ 
        where: { id: caseId }, 
        include: { client: { include: { user: true } }, lawyer: { include: { user: true } } } 
    });
    
    if (!targetCase) {
        throw new NotFoundException('Case not found');
    }
    
    if (targetCase.lawyer?.user?.id !== userId && targetCase.client.user.id !== userId) {
        throw new ForbiddenException('You are not assigned to this case');
    }

    if (!targetCase.lawyer_id) {
        throw new BadRequestException('Cannot add consultation, case has no lawyer');
    }

    const consult = await this.prisma.consultation.create({
      data: {
        case_id: caseId,
        lawyer_id: targetCase.lawyer_id, 
        client_id: targetCase.client_id,
        title: dto.title,
        consultation_at: new Date(dto.consultation_at),
        is_online: dto.is_online || false,
        link_meet: dto.link_meet,
        location: dto.location,
        notes: dto.notes,
      }
    });

    return {
      status: 'success',
      message: 'Consultation scheduled successfully',
      data: { consultation: consult }
    };
  }

  async addReview(caseId: string, dto: CreateReviewDto, userId: string) {
    const client = await this.prisma.client.findUnique({ where: { user_id: userId } });
    if (!client) throw new UnauthorizedException('Not a client');

    const targetCase = await this.prisma.case.findUnique({ where: { id: caseId }, include: { progress: true } });
    if (!targetCase) throw new NotFoundException('Case not found');
    
    const isClosed = targetCase.progress.some(p => p.status === CaseStatus.CLOSED);
    if (!isClosed) throw new BadRequestException('Case is not closed yet');
    if (!targetCase.lawyer_id) throw new BadRequestException('Case has no assigned lawyer');

    const review = await this.prisma.review.create({
      data: {
        case_id: caseId,
        client_id: client.id,
        lawyer_id: targetCase.lawyer_id,
        rating: dto.rating,
        comment: dto.comment,
      }
    });

    return {
      status: 'success',
      message: 'Review submitted successfully',
      data: { review }
    };
  }
}
