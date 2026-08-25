import { getCourse } from '@/lib/actions/course';
import { getQuizForCourse, getQuizAttempt } from '@/lib/actions/quiz';
import { notFound, redirect } from 'next/navigation';
import QuizPlayer from '@/components/quiz/QuizPlayer';
import Link from 'next/link';

export default async function QuizPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const quiz = await getQuizForCourse(course.documentId);
  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{course.title} Quiz</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">No quiz has been published for this course yet.</p>
          <Link href={`/courses/${params.slug}/lessons`} className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  const previousAttempt = await getQuizAttempt(quiz.documentId);
  if (previousAttempt) {
    // Already took the quiz
    redirect(`/courses/${params.slug}/quiz/results`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href={`/courses/${params.slug}/lessons`} className="text-sm font-medium text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Lessons
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-2">Course: <span className="font-bold">{course.title}</span></p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex items-start gap-4">
        <div className="text-3xl" aria-hidden="true">📝</div>
        <div>
          <h4 className="font-bold text-blue-900">Quiz Instructions</h4>
          <p className="text-blue-800 text-sm mt-1">
            Read each question carefully. You will not be able to change your answers after submitting. 
            Once you submit, your score will be calculated automatically.
          </p>
        </div>
      </div>

      <QuizPlayer quiz={quiz} courseSlug={params.slug} />
    </div>
  );
}
