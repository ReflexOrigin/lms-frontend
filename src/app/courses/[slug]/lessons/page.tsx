import { getCourse } from '@/lib/actions/course';
import { redirect } from 'next/navigation';

export default async function EnrolledCourseLandingPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const course = await getCourse(params.slug);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800">Course not found.</h1>
      </div>
    );
  }

  const lessons = course.lessons || [];

  if (lessons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{course.title}</h1>
        <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
          <p className="text-gray-500 font-medium">This course doesn't have any lessons yet. Please check back later.</p>
        </div>
      </div>
    );
  }

  // Find the first lesson (order ascending)
  const sortedLessons = [...lessons].sort((a: any, b: any) => a.order - b.order);
  const firstLesson = sortedLessons[0];

  redirect(`/courses/${params.slug}/lessons/${firstLesson.documentId}`);
}
