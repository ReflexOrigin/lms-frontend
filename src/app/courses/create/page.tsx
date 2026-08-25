'use client';

import CourseForm from '@/components/courses/CourseForm';
import { createCourse } from '@/lib/actions/course';
import Link from 'next/link';

export default function CreateCoursePage() {
  const handleSubmit = async (data: any) => {
    // This will throw if the server action fails
    return await createCourse(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard/instructor" className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Dashboard
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to draft your new course.</p>
      </div>

      <CourseForm onSubmit={handleSubmit} />
    </div>
  );
}
