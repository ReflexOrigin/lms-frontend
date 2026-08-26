'use client';

import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
