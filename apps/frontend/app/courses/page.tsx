'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateCourseInput } from '@edu-platform/shared';
import { coursesApi } from '@/lib/api/courses';
import { CourseForm } from '@/components/courses/CourseForm';
import { CourseList } from '@/components/courses/CourseList';

export default function CoursesPage() {
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleCreate = async (data: CreateCourseInput) => {
    createMutation.mutate(data);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="container mx-auto p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Course Management</h1>
      <CourseForm onSubmit={handleCreate} />
      <div className="mt-8">
        <CourseList courses={courses} onDelete={handleDelete} />
      </div>
    </div>
  );
}
