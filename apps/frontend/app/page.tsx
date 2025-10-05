import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Educational Platform</h1>
        <p className="text-gray-600 text-lg">Manage courses, students, and sell courses online</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link href="/courses">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Course Management</h2>
            <p className="text-gray-600 mb-4">Create and manage educational courses</p>
            <Button className="w-full">Manage Courses</Button>
          </Card>
        </Link>

        <Link href="/students">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Student Management</h2>
            <p className="text-gray-600 mb-4">Manage student accounts and enrollments</p>
            <Button className="w-full">Manage Students</Button>
          </Card>
        </Link>

        <Link href="/store">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Course Store</h2>
            <p className="text-gray-600 mb-4">Browse and purchase available courses</p>
            <Button className="w-full">Visit Store</Button>
          </Card>
        </Link>
      </div>
    </div>
  );
}
