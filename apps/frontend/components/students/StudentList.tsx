'use client';

import type { Student } from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => Promise<void>;
}

export function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  return (
    <div className="grid gap-4">
      {students.map((student) => (
        <Card key={student.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <p className="text-sm text-gray-600">{student.email}</p>
              <p className="text-xs text-gray-500 mt-2">
                Joined: {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(student)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete(student.id)}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
