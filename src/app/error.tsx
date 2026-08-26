'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="max-w-md bg-white p-8 border border-red-100 rounded-xl shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 text-sm mb-6">
          {error.message || 'We had trouble loading this data from the server.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
