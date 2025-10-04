import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
});

export const updateStudentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.email().optional(),
});

export const studentIdSchema = z.object({
  id: z.uuid(),
});

export const enrollmentSchema = z.object({
  studentId: z.uuid(),
  courseId: z.uuid(),
});
