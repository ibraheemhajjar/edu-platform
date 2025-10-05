'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCourseSchema, type CreateCourseInput } from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CourseFormProps {
  onSubmit: (data: CreateCourseInput) => Promise<void>;
}

export function CourseForm({ onSubmit }: CourseFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      author: '',
      published: true,
    },
  });

  const onFormSubmit = async (data: CreateCourseInput) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create Course</h2>
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

        <Button type="submit">Create Course</Button>
      </form>
    </Card>
  );
}
