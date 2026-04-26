import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EducationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEducationDto: CreateEducationDto, authorId: string) {
    const education = await this.prisma.education.create({
      data: {
        category_id: createEducationDto.category_id,
        author_id: authorId,
        title: createEducationDto.title,
        content: createEducationDto.content,
        image_url: createEducationDto.image_url,
      },
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    });

    return {
      status: 'success',
      message: 'Article created successfully',
      data: { education }
    };
  }

  async findAll(query: any = {}) {
    const { page = 1, limit = 10, category_id } = query;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const where: any = {};
    if (category_id) where.category_id = category_id;

    const [educations, total] = await Promise.all([
      this.prisma.education.findMany({
        where,
        include: {
          category: { select: { name: true } },
          author: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
        take,
        skip,
      }),
      this.prisma.education.count({ where }),
    ]);

    return {
      status: 'success',
      data: {
        educations,
        meta: {
          total_items: total,
          current_page: Number(page),
          total_pages: Math.ceil(total / take),
          per_page: take,
        }
      }
    };
  }

  async findOne(id: string) {
    const education = await this.prisma.education.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    });

    if (!education) throw new NotFoundException('Education article not found');

    return {
      status: 'success',
      data: { education }
    };
  }

  async update(id: string, updateEducationDto: UpdateEducationDto) {
    const existing = await this.prisma.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Education article not found');

    const education = await this.prisma.education.update({
      where: { id },
      data: updateEducationDto,
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    });

    return {
      status: 'success',
      message: 'Article updated successfully',
      data: { education }
    };
  }

  async remove(id: string) {
    const existing = await this.prisma.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Education article not found');

    await this.prisma.education.delete({ where: { id } });

    return {
      status: 'success',
      message: 'Article deleted successfully',
    };
  }
}
