import { createZodDto } from 'nestjs-zod';
import { createCourseSchema, updateCourseSchema, courseIdSchema } from '@edu-platform/shared';

export class CreateCourseDto extends createZodDto(createCourseSchema) {}
export class UpdateCourseDto extends createZodDto(updateCourseSchema) {}
export class CourseIdDto extends createZodDto(courseIdSchema) {
  id!: string;
}
