import { getCourse } from '@/lib/actions/course';
import { getLesson } from '@/lib/actions/lesson';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LessonViewer from '@/components/lessons/LessonViewer';

export default async function LessonPage(props: { params: Promise<{ slug: string; lessonId: string }> }) {
  const params = await props.params;
  
  // Fetch course (for syllabus sidebar) and lesson (for content) in parallel
  const [course, lesson] = await Promise.all([
    getCourse(params.slug).catch(() => null),
    getLesson(params.lessonId).catch(() => null),
  ]);

  if (!course || !lesson) {
    notFound();
  }

  const allLessons = [...(course.lessons || [])].sort((a: any, b: any) => a.order - b.order);
  const currentIndex = allLessons.findIndex((l: any) => l.documentId === params.lessonId);
  
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Sidebar Syllabus */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard/student" className="text-sm font-medium text-blue-600 hover:underline mb-2 inline-block">
            ← Dashboard
          </Link>
          <h2 className="font-extrabold text-xl text-gray-900 line-clamp-2">{course.title}</h2>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.round(((currentIndex + 1) / allLessons.length) * 100)}%` }}></div>
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-2">
            {currentIndex + 1} of {allLessons.length} Lessons
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {allLessons.map((l: any, idx: number) => {
            const isActive = l.documentId === params.lessonId;
            return (
              <Link 
                key={l.documentId} 
                href={`/courses/${params.slug}/lessons/${l.documentId}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                  {l.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
          {/* Mobile Sidebar Toggle - Placeholder */}
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Link href="/dashboard/student" className="text-sm font-medium text-blue-600 hover:underline">
              ← Dashboard
            </Link>
            <span className="text-sm font-semibold text-gray-500">Lesson {currentIndex + 1} of {allLessons.length}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{lesson.title}</h1>
          
          <LessonViewer content={lesson.content} videoUrl={lesson.videoUrl} />

          {/* Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            {prevLesson ? (
              <Link 
                href={`/courses/${params.slug}/lessons/${prevLesson.documentId}`}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                ← Previous
              </Link>
            ) : (
              <div></div>
            )}

            {nextLesson ? (
              <Link 
                href={`/courses/${params.slug}/lessons/${nextLesson.documentId}`}
                className="px-6 py-3 bg-blue-600 border border-transparent text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Next Lesson →
              </Link>
            ) : (
              <Link 
                href="/dashboard/student"
                className="px-6 py-3 bg-green-600 border border-transparent text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
              >
                Complete Course <span aria-hidden="true">🎉</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
