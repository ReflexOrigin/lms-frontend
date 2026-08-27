'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitQuizAttempt } from '@/lib/actions/quiz';
import { Loader2 } from 'lucide-react';

type QuizPlayerProps = {
  quiz: any;
  courseSlug: string;
};

export default function QuizPlayer({ quiz, courseSlug }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const questions = quiz?.questions || [];

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      if (!confirm('You have unanswered questions. Submit anyway?')) return;
    }

    setSubmitting(true);
    try {
      await submitQuizAttempt(quiz.documentId, answers);
      router.push(`/courses/${courseSlug}/quiz/results`);
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (!questions.length) {
    return (
      <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center">
        <p className="text-gray-500 font-medium">This quiz doesn't have any questions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {questions.map((q: any, idx: number) => (
        <div key={q.documentId} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600 mr-2">{idx + 1}.</span> 
            {q.text}
          </h3>
          
          <div className="space-y-3">
            {q.options.map((opt: string, oIdx: number) => {
              const isSelected = answers[q.documentId] === oIdx;
              return (
                <div 
                  key={oIdx}
                  onClick={() => handleOptionSelect(q.documentId, oIdx)}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors flex items-center gap-4 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className={`text-lg ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
        <p className="text-gray-600 font-medium">
          Answered {Object.keys(answers).length} of {questions.length} questions
        </p>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70 text-lg"
        >
          {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}
