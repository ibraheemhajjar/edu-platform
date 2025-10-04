export interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentInput {
  name: string;
  email: string;
}

export interface UpdateStudentInput {
  name?: string;
  email?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
}
