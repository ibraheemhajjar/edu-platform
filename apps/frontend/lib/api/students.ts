import type { Student, CreateStudentInput, UpdateStudentInput } from '@edu-platform/shared';
import { API_ROUTES } from '@edu-platform/shared';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BACKEND_URL}/api`;

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const res = await fetch(`${API_URL}${API_ROUTES.STUDENTS}`);
    return res.json();
  },

  create: async (data: CreateStudentInput): Promise<Student> => {
    const res = await fetch(`${API_URL}${API_ROUTES.STUDENTS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id: string, data: UpdateStudentInput): Promise<Student> => {
    const res = await fetch(`${API_URL}${API_ROUTES.STUDENTS}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}${API_ROUTES.STUDENTS}/${id}`, { method: 'DELETE' });
  },

  enroll: async (studentId: string, courseId: string): Promise<void> => {
    await fetch(`${API_URL}${API_ROUTES.ENROLL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
  },
};
