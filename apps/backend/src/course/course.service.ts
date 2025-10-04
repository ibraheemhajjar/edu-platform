import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseInput, UpdateCourseInput } from '@edu-platform/shared';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCourseInput) {
    return this.prisma.course.create({ data });
  }

  async findAll() {
    return this.prisma.course.findMany();
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateCourseInput) {
    return this.prisma.course.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }

  async syncToMedusa() {
    return this.prisma.course.findMany({ where: { published: true } });
  }
}
