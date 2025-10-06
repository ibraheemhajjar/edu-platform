'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCourseSchema,
  updateCourseSchema,
  type CreateCourseInput,
  type UpdateCourseInput,
  type Course,
} from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CreateCourseInput | UpdateCourseInput) => Promise<void>;
  onCancel?: () => void;
}

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const isEditing = !!course;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCourseInput | UpdateCourseInput>({
    resolver: zodResolver(isEditing ? updateCourseSchema : createCourseSchema),
    defaultValues: course || {
      title: '',
      description: '',
      price: 0,
      author: '',
      published: true,
    },
  });

  useEffect(() => {
    if (course) {
      reset(course);
    } else {
      reset({
        title: '',
        description: '',
        price: 0,
        author: '',
        published: true,
      });
    }
  }, [course, reset]);

  const onFormSubmit = async (data: CreateCourseInput | UpdateCourseInput) => {
    await onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Course' : 'Create Course'}</h2>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input {...register('title')} />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label>Description</Label>
          <Input {...register('description')} />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
        <div>
          <Label>Price</Label>
          <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label>Author</Label>
          <Input {...register('author')} />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register('published')} id="published" className="h-4 w-4" />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex gap-2">
          <Button type="submit">{isEditing ? 'Update Course' : 'Create Course'}</Button>
          {isEditing && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
