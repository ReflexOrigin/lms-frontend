import Link from "next/link";
import { Award, Flame, Target, TrendingUp } from "lucide-react";
import { Page } from "@/components/Page";
import { Card, CardHeader, ProgressBar, StatCard } from "@/components/ui";
import { fetchWithAuth } from "@/lib/api";

export default async function StudentProgress() {
  let enrolled: any[] = [];
  
  try {
    const res = await fetchWithAuth('/api/enrollments?populate=course.lessons');
    if (res.ok) {
      const data = await res.json();
      enrolled = data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch enrollments for progress", error);
  }

  const overall = enrolled.length
    ? Math.round(enrolled.reduce((s, curr) => s + (curr.progressPercentage || 0), 0) / enrolled.length)
    : 0;
  
  const totalLessons = enrolled.reduce((s, curr) => s + (curr.course?.lessons?.length || 0), 0);
  const doneLessons = enrolled.reduce((s, curr) => {
    // Very naive completion calculation without a specific progress API structure in place
    const pct = curr.progressPercentage || 0;
    const count = curr.course?.lessons?.length || 0;
    return s + Math.round((pct / 100) * count);
  }, 0);
  
  // Dummy fallback for metrics we don't have endpoints for yet
  const quizAvg = 0;

  return (
    <Page title="Your Progress" subtitle="A snapshot of your learning journey.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Progress" value={`${overall}%`} accentIcon icon={<TrendingUp size={16} />} />
        <StatCard label="Lessons Completed" value={`${doneLessons}/${totalLessons}`} icon={<Target size={16} />} />
        <StatCard label="Quiz Average" value={`${quizAvg}%`} icon={<Award size={16} />} />
        <StatCard label="Day Streak" value="0" icon={<Flame size={16} />} />
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
          {enrolled.length > 0 ? (
            <div className="p-5 space-y-5">
              {enrolled.map((curr) => {
                const c = curr.course;
                const p = curr.progressPercentage || 0;
                const totalL = c?.lessons?.length || 0;
                const doneL = Math.round((p / 100) * totalL);
                return (
                  <Link key={curr.documentId} href={`/courses/${c?.slug || c?.documentId}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                      <span className="text-xs font-medium text-blue-500">Cover</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium truncate group-hover:accent-text transition-colors">{c?.title || 'Unknown'}</span>
                        <span className="text-muted-foreground tabular-nums ml-2">{p}%</span>
                      </div>
                      <ProgressBar value={p} height={7} />
                      <div className="text-xs text-muted-foreground mt-1.5">
                        {doneL}/{totalL} lessons
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No active enrollments to track.
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
}

