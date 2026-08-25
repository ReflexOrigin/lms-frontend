'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type CourseFormProps = {
  initialData?: any; // If provided, we're in edit mode
  onSubmit: (data: any) => Promise<any>;
};

export default function CourseForm({ initialData, onSubmit }: CourseFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);
  
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
        description,
        thumbnail,
        isPublished,
      };

      const result = await onSubmit(data);
      // Result should have slug so we can redirect
      if (result?.slug) {
        router.push(`/courses/${result.slug}`);
      } else {
        router.push('/courses');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the course.');
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
        <label className="block text-sm font-semibold text-gray-800 mb-2">Course Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g., Introduction to React"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Description (HTML allowed)</label>
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="<p>Learn the basics of React...</p>"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Thumbnail URL</label>
        <input
          type="url"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="https://example.com/image.jpg"
        />
        {thumbnail && (
          <div className="mt-4 h-32 w-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isPublished" className="text-sm font-semibold text-gray-800 cursor-pointer">
          Publish Course (visible to students)
        </label>
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
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (initialData ? 'Save Changes' : 'Create Course')}
        </button>
      </div>
    </form>
  );
}
