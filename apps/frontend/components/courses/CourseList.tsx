'use client';

import type { Course } from '@edu-platform/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => Promise<void>;
}

export function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="text-sm my-2">
                By {course.author} - ${course.price}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  course.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {course.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(course)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete(course.id)}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
