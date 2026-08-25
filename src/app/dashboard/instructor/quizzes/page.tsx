"use client";
import { ListChecks, Pencil, Plus } from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, StatusPill } from "@/components/ui";
import { myCourses } from "../page";

const quizzesByCourse = myCourses.flatMap((c, ci) =>
  ["Module 1 Checkpoint", "Module 3 Assessment", ci === 0 ? "Final Exam" : "Practice Set"].map((title, i) => ({
    id: `${c.id}-q${i}`,
    title,
    course: c.title,
    questions: 5 + i * 3,
    attempts: 40 + i * 25 + ci * 10,
    avg: 68 + i * 6,
    status: i === 2 ? "draft" : "published",
  })),
);

export default function InstructorQuizzes() {
  return (
    <Page
      title="Quiz Management"
      subtitle="Assessments across your own courses."
      actions={
        <Button>
          <Plus size={16} /> New quiz
        </Button>
      }
    >
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
              <th className="font-medium px-5 py-3">Quiz</th>
              <th className="font-medium px-3 py-3">Course</th>
              <th className="font-medium px-3 py-3 text-right">Questions</th>
              <th className="font-medium px-3 py-3 text-right">Attempts</th>
              <th className="font-medium px-3 py-3 text-right">Avg. Score</th>
              <th className="font-medium px-3 py-3">Status</th>
              <th className="font-medium px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzesByCourse.map((q) => (
              <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <ListChecks size={16} className="text-muted-foreground" />
                    <span className="font-medium">{q.title}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{q.course}</td>
                <td className="px-3 py-3 text-right tabular-nums">{q.questions}</td>
                <td className="px-3 py-3 text-right tabular-nums">{q.attempts}</td>
                <td className="px-3 py-3 text-right tabular-nums">{q.avg}%</td>
                <td className="px-3 py-3">
                  <StatusPill status={q.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="w-8 h-8 rounded-lg hover:bg-muted inline-flex items-center justify-center text-muted-foreground">
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}


