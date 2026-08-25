'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markLessonComplete } from '@/lib/actions/progress';
import { Loader2, CheckCircle } from 'lucide-react';

type MarkCompleteButtonProps = {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
};

export default function MarkCompleteButton({ courseId, lessonId, isCompleted: initialCompleted }: MarkCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    if (isCompleted) return;
    setLoading(true);
    try {
      await markLessonComplete(courseId, lessonId);
      setIsCompleted(true);
      router.refresh(); // Refresh the page to update progress bar and sidebar
    } catch (err) {
      console.error('Failed to mark complete', err);
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <button 
        disabled
        className="px-6 py-3 bg-green-100 text-green-800 font-bold rounded-lg border border-green-200 flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <CheckCircle className="w-5 h-5" />
        Completed
      </button>
    );
  }

  return (
    <button 
      onClick={handleComplete}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 w-full sm:w-auto shadow-sm"
    >
      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
        <>
          <CheckCircle className="w-5 h-5" />
          Mark as Complete
        </>
      )}
    </button>
  );
}
