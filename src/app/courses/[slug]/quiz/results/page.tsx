import { getCourse } from '@/lib/actions/course';
import { getQuizForCourse, getQuizAttempt } from '@/lib/actions/quiz';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export default async function QuizResultsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const quiz = await getQuizForCourse(course.documentId);
  if (!quiz) notFound();

  const attempt = await getQuizAttempt(quiz.documentId);
  if (!attempt) {
    // Hasn't taken the quiz yet
    redirect(`/courses/${params.slug}/quiz`);
  }

  const passed = attempt.percentage >= 70;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Quiz Results</h1>
        <p className="text-xl text-gray-600">{course.title}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className={`p-12 text-center text-white ${passed ? 'bg-green-600' : 'bg-red-500'}`}>
          <div className="text-7xl mb-4" aria-hidden="true">{passed ? '🏆' : '📚'}</div>
          <h2 className="text-3xl font-bold mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          <p className="text-lg opacity-90">
            You scored {attempt.score} out of {attempt.totalQuestions}
          </p>
          <div className="text-6xl font-extrabold mt-6">
            {Math.round(attempt.percentage)}%
          </div>
        </div>

        <div className="p-8 bg-gray-50 text-center">
          <p className="text-gray-700 font-medium mb-8">
            {passed 
              ? "You've successfully passed the quiz for this course. Excellent job!" 
              : "You didn't quite reach the passing score of 70%. Review the course material and try again!"}
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              href={`/courses/${params.slug}/lessons`}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Back to Course
            </Link>
            <Link 
              href="/dashboard/student"
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
