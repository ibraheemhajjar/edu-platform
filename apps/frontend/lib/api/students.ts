import type { Student, CreateStudentInput } from '@edu-platform/shared';

const API_URL = 'http://localhost:3000/api';

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const res = await fetch(`${API_URL}/students`);
    return res.json();
  },

  create: async (data: CreateStudentInput): Promise<Student> => {
    const res = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
  },

  enroll: async (studentId: string, courseId: string): Promise<void> => {
    await fetch(`${API_URL}/students/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
  },
};
