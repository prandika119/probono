import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from 'src/prisma/generated/client/enums';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: string) {
    // Validasi type jika ada, untuk menghindari error enum parsing.
    let whereClause = {};
    if (type) {
        const typeUpper = type.toUpperCase();
        if (Object.values(CategoryType).includes(typeUpper as CategoryType)) {
            whereClause = { type: typeUpper as CategoryType };
        }
    }

    const categories = await this.prisma.category.findMany({ 
        where: whereClause 
    });
    
    return {
      status: 'success',
      data: {
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          type: c.type,
        })),
      },
    };
  }

  async create(dto: { name: string, type: CategoryType }) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: dto.name,
          mode: 'insensitive'
        },
        type: dto.type,
      }
    });

    if (existingCategory) {
      throw new BadRequestException(`Category with name "${dto.name}" and type "${dto.type}" already exists`);
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        type: dto.type,
      }
    });

    return {
      status: 'success',
      message: 'Category created successfully',
      data: { category }
    };
  }

  async remove(id: string) {
    try {
      await this.prisma.category.delete({
        where: { id }
      });
      return {
        status: 'success',
        message: 'Category deleted successfully'
      };
    } catch (error) {
      throw new Error('Failed to delete category, it might be in use');
    }
  }
}
