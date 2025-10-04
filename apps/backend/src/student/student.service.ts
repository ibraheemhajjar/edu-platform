import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentInput, UpdateStudentInput } from '@edu-platform/shared';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStudentInput) {
    return this.prisma.student.create({ data });
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: { enrollments: { include: { course: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { enrollments: { include: { course: true } } },
    });
  }

  async update(id: string, data: UpdateStudentInput) {
    return this.prisma.student.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.student.delete({ where: { id } });
  }

  async enroll(studentId: string, courseId: string) {
    return this.prisma.enrollment.create({
      data: { studentId, courseId },
      include: { course: true, student: true },
    });
  }
}
