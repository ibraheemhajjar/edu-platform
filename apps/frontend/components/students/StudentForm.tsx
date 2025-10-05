'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStudentSchema, type CreateStudentInput } from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentFormProps {
  onSubmit: (data: CreateStudentInput) => Promise<void>;
}

export function StudentForm({ onSubmit }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onFormSubmit = async (data: CreateStudentInput) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create Student</h2>
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
        <Button type="submit">Create Student</Button>
      </form>
    </Card>
  );
}
