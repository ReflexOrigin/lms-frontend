'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role?.type === 'admin_role' || user.role?.type === 'content_manager') {
          router.push('/dashboard/admin');
        } else if (user.role?.type === 'instructor') {
          router.push('/dashboard/instructor');
        } else {
          router.push('/dashboard/student');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
    </div>
  );
}
