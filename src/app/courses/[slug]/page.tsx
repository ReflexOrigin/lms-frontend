import { getCourse } from '@/lib/actions/course';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EnrollButton from '@/components/courses/EnrollButton';

export default async function CourseDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }

  // Calculate some derived values
  const lessons = course.lessons || [];
  
  // Later we'll integrate the EnrollButton component here
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/courses" className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Courses
      </Link>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        {course.thumbnail && (
          <div className="h-64 bg-gray-100 w-full">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-extrabold text-gray-900">{course.title}</h1>
              {!course.isPublished && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
                  DRAFT
                </span>
              )}
            </div>
            
            <p className="text-gray-500 font-medium mb-6">
              Instructor: {course.instructor?.username || 'Unknown'}
            </p>
            
            <div className="prose max-w-none text-gray-700">
              {/* If description is rich text, ideally render HTML. For now, text: */}
              {course.description ? (
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Course Info</h3>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• {lessons.length} Lessons</li>
                {course.quiz && <li>• 1 Quiz Included</li>}
              </ul>
              
              {/* Add Client Component EnrollButton here */}
              <EnrollButton courseId={course.documentId} courseSlug={course.slug} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus</h2>
        
        {lessons.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-100 text-center text-gray-500">
            No lessons available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any, index: number) => (
              <div key={lesson.documentId} className="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-4 hover:border-blue-300 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
