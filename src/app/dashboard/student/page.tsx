import { getMyEnrollments } from '@/lib/actions/enrollment';
import Link from 'next/link';

export default async function StudentDashboard() {
  const enrollments = await getMyEnrollments();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Continue learning where you left off.</p>
        </div>
        <Link 
          href="/courses"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
        >
          Browse Courses
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Enrolled Courses</h2>
        
        {(!enrollments || enrollments.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link href="/courses" className="text-blue-600 font-semibold hover:underline">
              Explore available courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: any) => {
              const course = enrollment.course;
              if (!course) return null;
              
              return (
                <div key={enrollment.documentId} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <div className="h-40 bg-gray-100 relative">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Enrolled on {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link 
                        href={`/courses/${course.slug}/lessons`}
                        className="w-full block text-center bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-2 rounded transition-colors"
                      >
                        Continue Course →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
