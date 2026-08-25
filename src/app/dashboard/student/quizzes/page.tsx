"use client";
import Link from "next/link";
import { ListChecks, Play } from "lucide-react";
import { Page } from "@/components/Page";
import { quizzes, recentQuizResults } from "@/data";
import { Badge, Button, Card, CardHeader } from "@/components/ui";
import { useLearn } from "@/contexts/LearnContext";

export default function StudentQuizzes() {
  const { results } = useLearn();
  const history = [
    ...results.map((r) => ({ quiz: r.title, course: r.course, score: r.score, date: r.date })),
    ...recentQuizResults,
  ];

  return (
    <Page title="Quizzes" subtitle="Test your understanding and track your scores.">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Available Quizzes" />
          <div className="p-3 space-y-2">
            {quizzes.map((q) => (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <span className="w-10 h-10 rounded-lg accent-soft-bg accent-text flex items-center justify-center shrink-0">
                  <ListChecks size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{q.title}</div>
                  <div className="text-xs text-muted-foreground">{q.courseTitle} · {q.questions.length} questions</div>
                </div>
                <Link href={`/student/quiz/${q.id}`}>
                  <Button size="sm">
                    <Play size={14} /> Start
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Quiz History" />
          <div className="divide-y divide-border">
            {history.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <div className="font-medium text-sm">{r.quiz}</div>
                  <div className="text-xs text-muted-foreground">{r.course} · {r.date}</div>
                </div>
                <Badge tone={r.score >= 80 ? "success" : r.score >= 60 ? "warning" : "danger"}>{r.score}%</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}

