"use client";
import Link from "next/link";
import { FileText, ListChecks, TrendingUp, Users } from "lucide-react";
import { Page } from "@/components/Page";
import { unsplash } from "@/data";
import { Button, Card, StatusPill } from "@/components/ui";
import { myCourses } from "../page";

export default function InstructorCourses() {
  return (
    <Page title="My Courses" subtitle="Courses you own and teach. You can only manage your own.">
      <Card className="divide-y divide-border overflow-hidden">
        {myCourses.map((c) => (
          <div key={c.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                <img src={unsplash(c.thumbId, 160, 160)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${c.slug}`} className="font-semibold hover:accent-text">
                    {c.title}
                  </Link>
                  <StatusPill status={c.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={13} /> {c.students} students</span>
                  <span className="flex items-center gap-1"><FileText size={13} /> {c.lessons.length} lessons</span>
                  <span>{c.completion}% completion</span>
                  <span>{c.quizAvg}% quiz avg</span>
                  <span>Updated {c.updated}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Link href={`/instructor/courses/${c.slug}`}>
                <Button size="sm" variant="outline">Edit</Button>
              </Link>
              <Link href="/instructor/lessons">
                <Button size="sm" variant="ghost"><FileText size={14} /> Lessons</Button>
              </Link>
              <Link href="/instructor/quizzes">
                <Button size="sm" variant="ghost"><ListChecks size={14} /> Quizzes</Button>
              </Link>
              <Link href="/instructor/progress">
                <Button size="sm" variant="ghost"><TrendingUp size={14} /> Progress</Button>
              </Link>
            </div>
          </div>
        ))}
      </Card>
    </Page>
  );
}


