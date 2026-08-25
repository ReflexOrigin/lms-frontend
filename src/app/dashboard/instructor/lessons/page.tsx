"use client";
import { useState } from "react";
import Link from "next/link";
import { FileText, Pencil, PlayCircle, Plus, Video } from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, Select, StatusPill } from "@/components/ui";
import { myCourses } from "../page";

export default function InstructorLessons() {
  const [courseId, setCourseId] = useState(myCourses[0].id);
  const course = myCourses.find((c) => c.id === courseId)!;

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
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-muted-foreground">Course</span>
        <Select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-72">
          {myCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
      </div>

      <Card className="divide-y divide-border overflow-hidden">
        {course.lessons.map((l) => (
          <div key={l.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40">
            <span className="w-8 text-sm font-mono text-muted-foreground">{String(l.order).padStart(2, "0")}</span>
            <span className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
              {l.type === "video" ? <Video size={16} /> : <FileText size={16} />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{l.title}</div>
              <div className="text-xs text-muted-foreground truncate">{l.summary}</div>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">{l.duration}</span>
            <StatusPill status={l.status} />
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
    </Page>
  );
}


