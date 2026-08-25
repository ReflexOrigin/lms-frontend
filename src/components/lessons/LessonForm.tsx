'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type LessonFormProps = {
  initialData?: any; 
  courseSlug: string; // To redirect back to course
  onSubmit: (data: any) => Promise<any>;
};

export default function LessonForm({ initialData, courseSlug, onSubmit }: LessonFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [order, setOrder] = useState<number>(initialData?.order || 0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        title,
        content,
        videoUrl,
        order: Number(order),
      };

      await onSubmit(data);
      router.push(`/courses/${courseSlug}/edit`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the lesson.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Lesson Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g., Understanding State in React"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Content (HTML allowed)</label>
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="<p>State allows React components to remember information...</p>"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Video URL (optional)</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Order (Sequence number)</label>
        <input
          type="number"
          required
          min={0}
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all max-w-[200px]"
        />
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 min-w-[120px]"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (initialData ? 'Save Changes' : 'Create Lesson')}
        </button>
      </div>
    </form>
  );
}
