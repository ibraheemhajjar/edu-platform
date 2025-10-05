import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  price: z.number().positive().min(0),
  author: z.string().min(2).max(100),
  published: z.boolean(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.number().positive().min(0).optional(),
  author: z.string().min(2).max(100).optional(),
  published: z.boolean().optional(),
});

export const courseIdSchema = z.object({
  id: z.uuid(),
});
