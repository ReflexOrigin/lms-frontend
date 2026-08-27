import { getCourses } from '@/lib/actions/course';
import Link from 'next/link';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Browse Courses</h1>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <div key={course.documentId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-100 flex flex-col">
              <div className="h-48 bg-blue-50 relative">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" suppressHydrationWarning />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-300 font-bold text-xl">
                    No Image
                  </div>
                )}
                {course.publishedAt ? (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">Published</span>
                ) : (
                  <span className="absolute top-4 right-4 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-gray-200">Draft</span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                  {/* Since description is richtext, we might just show a placeholder or stripping HTML */}
                  {course.description ? 'Click to view course details' : 'No description available'}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    By {course.instructor?.username || 'Unknown'}
                  </span>
                    <Link 
                      href={`/courses/${course.slug || course.documentId}`} 
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
