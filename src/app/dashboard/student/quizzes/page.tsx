import Link from "next/link";
import { ListChecks, Play } from "lucide-react";
import { Page } from "@/components/Page";
import { Badge, Button, Card, CardHeader } from "@/components/ui";
import { fetchWithAuth } from "@/lib/api";

export default async function StudentQuizzes() {
  let quizzes: any[] = [];
  let history: any[] = [];

  try {
    const [quizzesRes, historyRes] = await Promise.all([
      fetchWithAuth('/api/quizzes?populate=course'),
      fetchWithAuth('/api/quiz-attempts?populate=quiz.course')
    ]);

    if (quizzesRes.ok) quizzes = (await quizzesRes.json()).data || [];
    if (historyRes.ok) history = (await historyRes.json()).data || [];
  } catch (e) {
    console.error("Failed to fetch quiz data", e);
  }

  return (
    <Page title="Quizzes" subtitle="Test your understanding and track your scores.">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Available Quizzes" />
          <div className="p-3 space-y-2">
            {quizzes.length > 0 ? quizzes.map((q) => (
              <div key={q.documentId} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <span className="w-10 h-10 rounded-lg accent-soft-bg accent-text flex items-center justify-center shrink-0">
                  <ListChecks size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{q.title}</div>
                  <div className="text-xs text-muted-foreground">{q.course?.title || 'General'} · {q.questions?.length || 0} questions</div>
                </div>
                <Link href={`/courses/${q.course?.slug || q.course?.documentId}/quiz`}>
                  <Button size="sm">
                    <Play size={14} /> Start
                  </Button>
                </Link>
              </div>
            )) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No quizzes available yet.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Quiz History" />
          {history.length > 0 ? (
            <div className="divide-y divide-border">
              {history.map((r) => (
                <div key={r.documentId} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <div className="font-medium text-sm">{r.quiz?.title || 'Unknown Quiz'}</div>
                    <div className="text-xs text-muted-foreground">{r.quiz?.course?.title || 'General'} · {new Date(r.attemptedAt || r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Badge tone={r.score >= 80 ? "success" : r.score >= 60 ? "warning" : "danger"}>{r.score || 0}%</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              You haven't taken any quizzes yet.
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
}

