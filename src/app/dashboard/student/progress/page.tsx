"use client";
import Link from "next/link";
import { Award, Flame, Target, TrendingUp } from "lucide-react";
import { Page } from "@/components/Page";
import { courses, unsplash } from "@/data";
import { Card, CardHeader, ProgressBar, StatCard } from "@/components/ui";
import { useLearn } from "@/contexts/LearnContext";

export default function StudentProgress() {
  const { enrolled, progressFor, completedCount, results } = useLearn();
  const list = courses.filter((c) => enrolled.has(c.id));
  const overall = list.length
    ? Math.round(list.reduce((s, c) => s + progressFor(c.id), 0) / list.length)
    : 0;
  const totalLessons = list.reduce((s, c) => s + c.lessons.length, 0);
  const doneLessons = list.reduce((s, c) => s + completedCount(c.id), 0);
  const quizAvg = results.length
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 84;

  return (
    <Page title="Your Progress" subtitle="A snapshot of your learning journey.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Progress" value={`${overall}%`} accentIcon icon={<TrendingUp size={16} />} />
        <StatCard label="Lessons Completed" value={`${doneLessons}/${totalLessons}`} icon={<Target size={16} />} />
        <StatCard label="Quiz Average" value={`${quizAvg}%`} icon={<Award size={16} />} />
        <StatCard label="Day Streak" value="12" icon={<Flame size={16} />} />
      </div>

      {/* Overall ring + course breakdown */}
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="flex flex-col items-center justify-center py-8">
          <CardHeader title="Overall Learning" className="self-start" />
          <div
            className="mt-4 w-40 h-40 rounded-full flex items-center justify-center"
            style={{ background: `conic-gradient(var(--accent) ${overall * 3.6}deg, var(--color-muted) 0deg)` }}
          >
            <div className="w-32 h-32 rounded-full bg-card flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold tabular-nums">{overall}%</span>
              <span className="text-xs text-muted-foreground mt-0.5">complete</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Course Progress" subtitle="Enrolled courses" />
          <div className="p-5 space-y-5">
            {list.map((c) => {
              const p = progressFor(c.id);
              return (
                <Link key={c.id} href={`/student/learn/${c.slug}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img src={unsplash(c.thumbId, 120, 120)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium truncate group-hover:accent-text transition-colors">{c.title}</span>
                      <span className="text-muted-foreground tabular-nums ml-2">{p}%</span>
                    </div>
                    <ProgressBar value={p} height={7} />
                    <div className="text-xs text-muted-foreground mt-1.5">
                      {completedCount(c.id)}/{c.lessons.length} lessons · quiz avg {c.quizAvg}%
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </Page>
  );
}

