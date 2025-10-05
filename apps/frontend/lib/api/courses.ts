import type { Course, CreateCourseInput } from '@edu-platform/shared';

const API_URL = 'http://localhost:3000/api';

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const res = await fetch(`${API_URL}/courses`);
    return res.json();
  },

  create: async (data: CreateCourseInput): Promise<Course> => {
    const res = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
  },
};
