"use client";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Page } from "@/components/Page";
import { courses, myLearning, recentQuizResults, studentActivity, unsplash } from "@/data";
import { Avatar, Badge, Button, Card, CardHeader, ProgressBar } from "@/components/ui";
import { LearningCard } from "@/components/CourseCard";
import { useLearn } from "@/contexts/LearnContext";

export default function StudentDashboard() {
  const { progressFor, completedCount } = useLearn();
  const enrolled = myLearning
    .map((m) => ({ ...m, course: courses.find((c) => c.id === m.courseId)! }))
    .filter((m) => m.course);
  const feature = enrolled[0];
  const featProgress = progressFor(feature.courseId);

  return (
    <Page title="Welcome back, Alex" subtitle="Pick up where you left off.">
      {/* Continue learning hero */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="aspect-[16/10] md:aspect-auto bg-muted relative">
            <img src={unsplash(feature.course.thumbId, 720, 480)} alt={feature.course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
          </div>
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <Badge tone="accent">
              <Sparkles size={13} /> Continue learning
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight mt-3">{feature.course.title}</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              with {feature.course.instructor} · Next: {feature.lastLesson}
            </p>
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Your progress</span>
                <span className="font-semibold tabular-nums">{featProgress}%</span>
              </div>
              <ProgressBar value={featProgress} height={10} />
              <p className="text-xs text-muted-foreground mt-2">
                {completedCount(feature.courseId)} of {feature.course.lessons.length} lessons complete
              </p>
            </div>
            <Link href={`/student/learn/${feature.course.slug}`} className="mt-6">
              <Button size="lg">
                <Play size={16} /> Continue lesson
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* My courses */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-lg font-semibold tracking-tight">My courses</h2>
        <Link href="/student/courses" className="text-sm font-medium accent-text flex items-center gap-1">
          View all <ArrowRight size={15} />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrolled.map((m) => (
          <LearningCard
            key={m.courseId}
            course={m.course}
            progress={progressFor(m.courseId)}
            lessonsCompleted={completedCount(m.courseId)}
            lastLesson={m.lastLesson}
            href={`/student/learn/${m.course.slug}`}
          />
        ))}
      </div>

      {/* Recent quizzes + activity */}
      <div className="grid lg:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader
            title="Recent Quiz Results"
            action={
              <Link href="/student/quizzes">
                <Button variant="ghost" size="sm">
                  All quizzes
                </Button>
              </Link>
            }
          />
          <div className="divide-y divide-border">
            {recentQuizResults.map((r) => (
              <div key={r.quiz} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <div className="font-medium text-sm">{r.quiz}</div>
                  <div className="text-xs text-muted-foreground">{r.course} · {r.date}</div>
                </div>
                <Badge tone={r.score >= 80 ? "success" : r.score >= 60 ? "warning" : "danger"}>{r.score}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Learning Activity" />
          <ul className="px-5 py-4 space-y-4">
            {studentActivity.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full accent-bg shrink-0" />
                <div>
                  <p className="text-[13px] leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Page>
  );
}

