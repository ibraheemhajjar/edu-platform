'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/lib/api/students';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MyCoursesPage() {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const { data: students } = useQuery({
    queryKey: ['students', searchEmail],
    queryFn: () => studentsApi.getAll(),
    enabled: !!searchEmail,
  });

  const student = students?.find((s) => s.email === searchEmail);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enter Your Email</CardTitle>
          <CardDescription>View courses you are enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={() => setSearchEmail(email)}>View Courses</Button>
          </div>
        </CardContent>
      </Card>

      {searchEmail && !student && (
        <p className="text-muted-foreground">No student found with email: {searchEmail}</p>
      )}

      {student && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Enrolled Courses for {student.name}</h2>
          {student.enrollments && student.enrollments.length > 0 ? (
            <div className="grid gap-4">
              {student.enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <CardTitle>{enrollment.course.title}</CardTitle>
                    <CardDescription>By {enrollment.course.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {enrollment.course.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No enrolled courses yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
