import type { Course, CreateCourseInput, UpdateCourseInput } from '@edu-platform/shared';
import { API_ROUTES } from '@edu-platform/shared';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BACKEND_URL}/api`;

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const res = await fetch(`${API_URL}${API_ROUTES.COURSES}`);
    return res.json();
  },

  create: async (data: CreateCourseInput): Promise<Course> => {
    const res = await fetch(`${API_URL}${API_ROUTES.COURSES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id: string, data: UpdateCourseInput): Promise<Course> => {
    const res = await fetch(`${API_URL}${API_ROUTES.COURSES}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}${API_ROUTES.COURSES}/${id}`, { method: 'DELETE' });
  },
};
