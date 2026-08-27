'use client';

import CourseForm from '@/components/courses/CourseForm';
import { createCourse } from '@/lib/actions/course';
import { Page } from '@/components/Page';

export default function CreateInstructorCoursePage() {
  const handleSubmit = async (data: any) => {
    // The backend course controller automatically attaches the logged-in instructor
    return await createCourse(data);
  };

  return (
    <Page title="Create New Course" subtitle="Fill in the details below to draft your new course.">
      <div className="max-w-3xl">
        <CourseForm onSubmit={handleSubmit} />
      </div>
    </Page>
  );
}
