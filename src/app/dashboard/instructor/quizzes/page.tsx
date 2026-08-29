import Link from "next/link";
import { ListChecks, Pencil, Plus } from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, StatusPill } from "@/components/ui";
import { fetchWithAuth } from "@/lib/api";

export default async function InstructorQuizzes() {
  let quizzes: any[] = [];
  try {
    const res = await fetchWithAuth('/api/quizzes?populate[0]=course&managerView=true');
    if (res.ok) {
      quizzes = (await res.json()).data || [];
    }
  } catch (error) {
    console.error("Failed to fetch instructor quizzes", error);
  }

  return (
    <Page
      title="Quiz Management"
      subtitle="Assessments across your own courses."
      actions={
        <Link href="/dashboard/instructor/courses">
          <Button>
            <Plus size={16} /> New quiz
          </Button>
        </Link>
      }
    >
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
              <th className="font-medium px-5 py-3">Quiz</th>
              <th className="font-medium px-3 py-3">Course</th>
              <th className="font-medium px-3 py-3 text-right">Questions</th>
              <th className="font-medium px-3 py-3">Status</th>
              <th className="font-medium px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length > 0 ? quizzes.map((q) => (
              <tr key={q.documentId} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <ListChecks size={16} className="text-muted-foreground" />
                    <span className="font-medium">{q.title}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{q.course?.title || 'General'}</td>
                <td className="px-3 py-3 text-right tabular-nums">{q.questions?.length || 0}</td>
                <td className="px-3 py-3">
                  <StatusPill status={q.course?.publishedAt ? 'published' : 'draft'} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/courses/${q.course?.slug}/quiz/edit`} className="w-8 h-8 rounded-lg hover:bg-muted inline-flex items-center justify-center text-muted-foreground">
                    <Pencil size={16} />
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  You haven't created any quizzes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}


