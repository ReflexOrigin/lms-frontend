'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuestion, deleteQuestion } from '@/lib/actions/quiz';
import { Loader2, Trash2 } from 'lucide-react';

type QuizFormProps = {
  quiz: any;
  courseSlug: string;
};

export default function QuizForm({ quiz, courseSlug }: QuizFormProps) {
  const [questions, setQuestions] = useState<any[]>(quiz?.questions || []);
  
  // New question form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleAddOption = () => {
    setNewOptions([...newOptions, '']);
  };

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...newOptions];
    updated[idx] = value;
    setNewOptions(updated);
  };

  const handleRemoveOption = (idx: number) => {
    const updated = newOptions.filter((_, i) => i !== idx);
    setNewOptions(updated);
    if (correctIndex === idx) setCorrectIndex(0);
    else if (correctIndex > idx) setCorrectIndex(correctIndex - 1);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOptions.some(o => !o.trim())) {
      alert("All options must have text.");
      return;
    }
    
    setLoading(true);
    try {
      const created = await createQuestion(quiz.documentId, {
        text: newText,
        options: newOptions,
        correctAnswer: correctIndex
      });
      setQuestions([...questions, created]);
      // Reset form
      setNewText('');
      setNewOptions(['', '', '', '']);
      setCorrectIndex(0);
      setShowAddForm(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      await deleteQuestion(id);
      setQuestions(questions.filter(q => q.documentId !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quiz Questions</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {showAddForm ? 'Cancel' : '+ Add Question'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSaveQuestion} className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 space-y-4">
            <h3 className="font-bold text-blue-900 mb-4">New Question</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Question Text</label>
              <textarea
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="What is the capital of France?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Options</label>
              <div className="space-y-3">
                {newOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input 
                      type="radio"
                      name="correctAnswer"
                      checked={correctIndex === idx}
                      onChange={() => setCorrectIndex(idx)}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      title="Mark as correct answer"
                    />
                    <input
                      required
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${idx + 1}`}
                    />
                    {newOptions.length > 2 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={handleAddOption}
                className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
              >
                + Add Option
              </button>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Question'}
              </button>
            </div>
          </form>
        )}

        {questions.length === 0 && !showAddForm ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No questions added yet.
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={q.documentId} className="p-6 border border-gray-200 rounded-xl relative hover:border-gray-300 transition-colors">
                <button 
                  onClick={() => handleDelete(q.documentId)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  title="Delete Question"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <h4 className="font-bold text-gray-900 mb-4 pr-12">{qIdx + 1}. {q.text}</h4>
                <div className="space-y-2">
                  {q.options.map((opt: string, oIdx: number) => (
                    <div 
                      key={oIdx} 
                      className={`p-3 rounded-lg border ${
                        q.correctAnswer === oIdx 
                          ? 'bg-green-50 border-green-200 text-green-800 font-medium' 
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {q.correctAnswer === oIdx && <span className="mr-2 font-bold">✓</span>}
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
