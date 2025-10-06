'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Student, CreateStudentInput, UpdateStudentInput } from '@edu-platform/shared';
import { studentsApi } from '@/lib/api/students';
import { StudentForm } from '@/components/students/StudentForm';
import { StudentList } from '@/components/students/StudentList';

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentInput }) =>
      studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setEditingStudent(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleSubmit = async (data: CreateStudentInput | UpdateStudentInput) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    } else {
      createMutation.mutate(data as CreateStudentInput);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleCancelEdit = () => {
    setEditingStudent(undefined);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="container mx-auto p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Management</h1>
      <StudentForm
        student={editingStudent}
        onSubmit={handleSubmit}
        onCancel={editingStudent ? handleCancelEdit : undefined}
      />
      <div className="mt-8">
        <StudentList students={students} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}
