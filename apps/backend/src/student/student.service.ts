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

  async enrollFromOrder(email: string, courseIds: string[]) {
    // Find or create student
    let student = await this.prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      student = await this.prisma.student.create({
        data: {
          name: email.split('@')[0],
          email,
        },
      });
    }

    // Enroll in each course
    const enrollments = await Promise.all(
      courseIds.map((courseId) =>
        this.prisma.enrollment.create({
          data: {
            studentId: student.id,
            courseId,
          },
        }),
      ),
    );

    return { success: true, student, enrollments };
  }
}
