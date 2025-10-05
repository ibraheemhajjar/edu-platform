import { createZodDto } from 'nestjs-zod';
import {
  createStudentSchema,
  updateStudentSchema,
  studentIdSchema,
  enrollmentSchema,
} from '@edu-platform/shared';

export class CreateStudentDto extends createZodDto(createStudentSchema) {}
export class UpdateStudentDto extends createZodDto(updateStudentSchema) {}
export class StudentIdDto extends createZodDto(studentIdSchema) {
  id!: string;
}
export class EnrollmentDto extends createZodDto(enrollmentSchema) {
  studentId!: string;
  courseId!: string;
}
