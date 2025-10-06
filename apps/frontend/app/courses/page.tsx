'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Course, CreateCourseInput, UpdateCourseInput } from '@edu-platform/shared';
import { coursesApi } from '@/lib/api/courses';
import { CourseForm } from '@/components/courses/CourseForm';
import { CourseList } from '@/components/courses/CourseList';

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);

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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) =>
      coursesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setEditingCourse(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleSubmit = async (data: CreateCourseInput | UpdateCourseInput) => {
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data });
    } else {
      createMutation.mutate(data as CreateCourseInput);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
  };

  const handleCancelEdit = () => {
    setEditingCourse(undefined);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="container mx-auto p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Course Management</h1>
      <CourseForm
        course={editingCourse}
        onSubmit={handleSubmit}
        onCancel={editingCourse ? handleCancelEdit : undefined}
      />
      <div className="mt-8">
        <CourseList courses={courses} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}
