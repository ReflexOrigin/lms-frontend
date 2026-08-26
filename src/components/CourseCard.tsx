"use client";
import Link from "next/link";
import { Clock, Signal, Star, Users } from "lucide-react";
import { unsplash, type Course } from "../data";
import { Avatar, Badge, ProgressBar } from "./ui";

// Marketing / discovery course card (no management controls).
export function DiscoveryCard({ course, href }: { course: any; href: string }) {
  const instructorName = typeof course.instructor === 'string' ? course.instructor : course.instructor?.username || course.instructor?.name || "Instructor";
  const studentCount = course.students || course.enrollments?.length || 0;
  const lessonCount = course.lessons?.length || 0;

  return (
    <Link
      href={href}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        <img
          suppressHydrationWarning
          src={unsplash(course.thumbId || course.documentId, 640, 360)}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge tone="accent">{course.category || "General"}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Signal size={13} /> {course.difficulty || "Beginner"}
          </span>
        </div>
        <h3 className="font-semibold leading-snug group-hover:accent-text transition-colors">
          {course.title}
        </h3>
        <p className="text-[13px] text-muted-foreground mt-1.5 line-clamp-2 flex-1">
          {course.description || "No description available."}
        </p>
        <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-border">
          <Avatar name={instructorName} tone="#4f46e5" size={24} />
          <span className="text-xs text-muted-foreground flex-1 truncate">{instructorName}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Star size={13} className="fill-[var(--color-warning)] text-[var(--color-warning)]" />
            {course.rating || "New"}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {course.duration || "2h"}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {studentCount.toLocaleString()}
          </span>
          <span>{lessonCount} lessons</span>
        </div>
      </div>
    </Link>
  );
}

// Enrolled course card with personal progress (student learning surface).
export function LearningCard({
  course,
  progress,
  lessonsCompleted,
  lastLesson,
  href,
}: {
  course: any;
  progress: number;
  lessonsCompleted: number;
  lastLesson: string;
  href: string;
}) {
  if (!course) return null;
  const instructorName = typeof course.instructor === 'string' ? course.instructor : course.instructor?.username || course.instructor?.name || "Instructor";
  const lessonCount = course.lessons?.length || 0;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="aspect-[16/7] bg-muted overflow-hidden relative">
        <img
          suppressHydrationWarning
          src={unsplash(course.thumbId || course.documentId, 640, 280)}
          alt={course.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge tone="accent">{progress}% complete</Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold leading-snug">{course.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{instructorName}</p>
        <div className="mt-3">
          <ProgressBar value={progress} />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>
              {lessonsCompleted}/{lessonCount} lessons
            </span>
            <span className="truncate ml-2">Next: {lastLesson}</span>
          </div>
        </div>
        <Link
          href={href}
          className="mt-4 h-9 rounded-lg accent-bg text-white text-sm font-medium flex items-center justify-center hover:brightness-110 transition"
        >
          Continue learning
        </Link>
      </div>
    </div>
  );
}

