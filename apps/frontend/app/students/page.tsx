'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateStudentInput } from '@edu-platform/shared';
import { studentsApi } from '@/lib/api/students';
import { StudentForm } from '@/components/students/StudentForm';
import { StudentList } from '@/components/students/StudentList';

export default function StudentsPage() {
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: studentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleCreate = async (data: CreateStudentInput) => {
    createMutation.mutate(data);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="container mx-auto p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Student Management</h1>
      <StudentForm onSubmit={handleCreate} />
      <div className="mt-8">
        <StudentList students={students} onDelete={handleDelete} />
      </div>
    </div>
  );
}
