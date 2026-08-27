import Link from "next/link";
import { FileText, Pencil, PlayCircle, Plus, Video } from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, StatusPill } from "@/components/ui";
import { getCourses } from "@/lib/services/courseService";

export default async function InstructorLessons() {
  let myCourses: any[] = [];
  try {
    // Fetch courses and populate their lessons. getCourses handles the instructorView flag.
    myCourses = await getCourses('instructorView=true');
  } catch (error) {
    console.error("Failed to fetch instructor lessons", error);
  }

  return (
    <Page
      title="Lesson Management"
      subtitle="Manage lessons for your own courses."
      actions={
        <Button>
          <Plus size={16} /> New lesson
        </Button>
      }
    >
      {myCourses.length > 0 ? myCourses.map((course) => (
        <div key={course.documentId} className="mb-8">
          <h3 className="font-semibold text-lg tracking-tight mb-3">{course.title}</h3>
          
          {course.lessons && course.lessons.length > 0 ? (
            <Card className="divide-y divide-border overflow-hidden">
              {course.lessons.map((l: any, idx: number) => (
                <div key={l.documentId} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40">
                  <span className="w-8 text-sm font-mono text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    {l.type === "video" ? <Video size={16} /> : <FileText size={16} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{l.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.summary || "No description available."}</div>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block">{l.duration || '0:00'}</span>
                  <StatusPill status={l.publishedAt ? 'published' : 'draft'} />
                  <div className="flex gap-1">
                    <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                      <PlayCircle size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <Card className="p-6 text-center text-sm text-gray-500 border-dashed border-gray-200">
              No lessons have been added to this course yet.
            </Card>
          )}
        </div>
      )) : (
        <Card className="p-8 text-center bg-gray-50 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium mb-4">You haven't authored any courses yet.</p>
        </Card>
      )}
    </Page>
  );
}


