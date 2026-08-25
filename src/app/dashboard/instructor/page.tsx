import { getCourses } from '@/lib/actions/course';
import Link from 'next/link';

// Since this is a server component in a protected route, it will only render if the user is an instructor.
// The `getCourses` action will automatically use the JWT from the cookie, which will filter to their own courses
// because of our backend Layer 2 Controller Override!

export default async function InstructorDashboard() {
  const courses = await getCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your courses, lessons, and students.</p>
        </div>
        <Link 
          href="/courses/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
        >
          + Create New Course
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
            <Link href="/courses/create" className="text-blue-600 font-semibold hover:underline">
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold rounded-tl-lg">Title</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Lessons</th>
                  <th scope="col" className="px-6 py-3 font-semibold rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course: any) => (
                  <tr key={course.documentId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4">
                      {course.isPublished ? (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">Published</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-yellow-200">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {/* Requires populated lessons, if not populated it might be undefined */}
                      {course.lessons?.length || 0}
                    </td>
                    <td className="px-6 py-4 space-x-4">
                      <Link href={`/courses/${course.slug}`} className="text-blue-600 hover:underline font-medium">View</Link>
                      <Link href={`/courses/${course.slug}/edit`} className="text-blue-600 hover:underline font-medium">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
