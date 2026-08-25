'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LessonForm from '@/components/lessons/LessonForm';
import { getLesson, updateLesson } from '@/lib/actions/lesson';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditLessonPage(props: { params: Promise<{ slug: string; lessonId: string }> }) {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const [params, setParams] = useState<{ slug: string; lessonId: string } | null>(null);

  useEffect(() => {
    props.params.then(setParams);
  }, [props.params]);

  useEffect(() => {
    if (!params) return;

    const fetchLesson = async () => {
      try {
        const data = await getLesson(params.lessonId);
        if (!data) throw new Error('Lesson not found');
        setLesson(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [params]);

  const handleSubmit = async (data: any) => {
    if (!lesson?.documentId) return;
    return await updateLesson(lesson.documentId, data);
  };

  if (loading || !params) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/courses/${params.slug}/edit`} className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Course Edit
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Edit Lesson</h1>
        <p className="text-gray-600 mt-2">Update the details for "{lesson.title}".</p>
      </div>

      <LessonForm initialData={lesson} courseSlug={params.slug} onSubmit={handleSubmit} />
    </div>
  );
}
