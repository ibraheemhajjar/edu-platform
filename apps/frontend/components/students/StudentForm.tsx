'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createStudentSchema,
  updateStudentSchema,
  type CreateStudentInput,
  type UpdateStudentInput,
  type Student,
} from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: CreateStudentInput | UpdateStudentInput) => Promise<void>;
  onCancel?: () => void;
}

export function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const isEditing = !!student;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStudentInput | UpdateStudentInput>({
    resolver: zodResolver(isEditing ? updateStudentSchema : createStudentSchema),
    defaultValues: student || {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (student) {
      reset(student);
    } else {
      reset({
        name: '',
        email: '',
      });
    }
  }, [student, reset]);

  const onFormSubmit = async (data: CreateStudentInput | UpdateStudentInput) => {
    await onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Student' : 'Create Student'}
      </h2>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" {...register('email')} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit">{isEditing ? 'Update Student' : 'Create Student'}</Button>
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
