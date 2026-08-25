'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CourseForm from '@/components/courses/CourseForm';
import { getCourse, updateCourse } from '@/lib/actions/course';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage(props: { params: Promise<{ slug: string }> }) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Unwrapping params correctly in React 19 / Next 15
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    props.params.then(p => setSlug(p.slug));
  }, [props.params]);

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        const data = await getCourse(slug);
        if (!data) {
          throw new Error('Course not found');
        }
        setCourse(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const handleSubmit = async (data: any) => {
    if (!course?.documentId) return;
    return await updateCourse(course.documentId, data);
  };

  if (loading || !slug) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/courses/${slug}`} className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Course
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Edit Course</h1>
        <p className="text-gray-600 mt-2">Update the details for "{course.title}".</p>
      </div>

      <CourseForm initialData={course} onSubmit={handleSubmit} />

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
          <Link 
            href={`/courses/${slug}/lessons/create`}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            + Add Lesson
          </Link>
        </div>

        {(!course.lessons || course.lessons.length === 0) ? (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
            No lessons added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {course.lessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any) => (
              <div key={lesson.documentId} className="bg-white p-6 rounded-xl border border-gray-100 flex items-center justify-between hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                    {lesson.order}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link 
                    href={`/courses/${slug}/lessons/${lesson.documentId}/edit`}
                    className="text-blue-600 hover:underline font-semibold text-sm"
                  >
                    Edit
                  </Link>
                  {/* We could add delete here, but sticking to edit for simplicity */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
