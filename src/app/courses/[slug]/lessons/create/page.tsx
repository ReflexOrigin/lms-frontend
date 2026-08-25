'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LessonForm from '@/components/lessons/LessonForm';
import { createLesson } from '@/lib/actions/lesson';
import { getCourse } from '@/lib/actions/course';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateLessonPage(props: { params: Promise<{ slug: string }> }) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    props.params.then(p => setSlug(p.slug));
  }, [props.params]);

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        const data = await getCourse(slug);
        if (!data) throw new Error('Course not found');
        setCourse(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load course context');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const handleSubmit = async (data: any) => {
    if (!course?.documentId) return;
    return await createLesson(course.documentId, data);
  };

  if (loading || !slug) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/courses/${slug}/edit`} className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Course Edit
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Add New Lesson</h1>
        <p className="text-gray-600 mt-2">Adding lesson to: <span className="font-bold">{course.title}</span></p>
      </div>

      <LessonForm courseSlug={slug} onSubmit={handleSubmit} />
    </div>
  );
}
