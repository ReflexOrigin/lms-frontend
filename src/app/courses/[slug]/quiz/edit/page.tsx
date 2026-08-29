'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCourse } from '@/lib/actions/course';
import { getQuizForCourse, createQuiz } from '@/lib/actions/quiz';
import QuizForm from '@/components/quiz/QuizForm';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditQuizPage(props: { params: Promise<{ slug: string }> }) {
  const [course, setCourse] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    props.params.then(p => setSlug(p.slug));
  }, [props.params]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const cData = await getCourse(slug, true);
        if (!cData) throw new Error('Course not found');
        setCourse(cData);
        
        const qData = await getQuizForCourse(cData.documentId, true);
        setQuiz(qData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleCreateQuiz = async () => {
    if (!course?.documentId) return;
    setCreating(true);
    try {
      const newQuiz = await createQuiz(course.documentId, `${course.title} Quiz`);
      setQuiz(newQuiz);
    } catch (err: any) {
      alert(err.message || 'Failed to create quiz');
    } finally {
      setCreating(false);
    }
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
        <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/courses/${slug}/edit`} className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Course Edit
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Manage Course Quiz</h1>
        <p className="text-gray-600 mt-2">Course: <span className="font-bold">{course.title}</span></p>
      </div>

      {!quiz ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Quiz Found</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">This course doesn't have a quiz yet. Create one to test your students' knowledge and provide auto-graded assessments.</p>
          <button
            onClick={handleCreateQuiz}
            disabled={creating}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-70"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Quiz Now'}
          </button>
        </div>
      ) : (
        <QuizForm quiz={quiz} courseSlug={slug} />
      )}
    </div>
  );
}
