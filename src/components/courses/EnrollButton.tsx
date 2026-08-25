'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkEnrollment, createEnrollment } from '@/lib/actions/enrollment';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type EnrollButtonProps = {
  courseId: number;
  courseSlug: string;
};

export default function EnrollButton({ courseId, courseSlug }: EnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role?.type === 'authenticated') {
      checkEnrollment(courseId).then(setIsEnrolled);
    }
  }, [user, courseId]);

  const handleAction = async () => {
    if (!user) {
      router.push(`/login?redirect=/courses/${courseSlug}`);
      return;
    }

    if (user.role?.type !== 'authenticated') {
      // Not a student
      return;
    }

    if (isEnrolled) {
      // Go to course viewer
      router.push(`/courses/${courseSlug}/lessons`);
    } else {
      // Enroll
      setLoading(true);
      setError('');
      try {
        await createEnrollment(courseId);
        setIsEnrolled(true);
        router.push(`/courses/${courseSlug}/lessons`);
      } catch (err: any) {
        setError(err.message || 'Failed to enroll');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user || user.role?.type !== 'authenticated') {
    return (
      <button 
        onClick={() => router.push('/login')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Sign in to Enroll
      </button>
    );
  }

  if (isEnrolled === null) {
    return (
      <button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-lg flex items-center justify-center">
        <Loader2 className="animate-spin h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button 
        onClick={handleAction}
        disabled={loading}
        className={`w-full font-bold py-3 rounded-lg transition-colors flex items-center justify-center ${
          isEnrolled 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-70`}
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isEnrolled ? 'Go to Course' : 'Enroll Now')}
      </button>
      {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
    </div>
  );
}
