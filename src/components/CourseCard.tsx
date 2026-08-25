"use client";
import Link from "next/link";
import { Clock, Signal, Star, Users } from "lucide-react";
import { unsplash, type Course } from "../data";
import { Avatar, Badge, ProgressBar } from "./ui";

// Marketing / discovery course card (no management controls).
export function DiscoveryCard({ course, href }: { course: Course; href: string }) {
  return (
    <Link
      href={href}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        <img
          src={unsplash(course.thumbId, 640, 360)}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge tone="accent">{course.category}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Signal size={13} /> {course.difficulty}
          </span>
        </div>
        <h3 className="font-semibold leading-snug group-hover:accent-text transition-colors">
          {course.title}
        </h3>
        <p className="text-[13px] text-muted-foreground mt-1.5 line-clamp-2 flex-1">
          {course.description}
        </p>
        <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-border">
          <Avatar name={course.instructor} tone="#4f46e5" size={24} />
          <span className="text-xs text-muted-foreground flex-1 truncate">{course.instructor}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Star size={13} className="fill-[var(--color-warning)] text-[var(--color-warning)]" />
            {course.rating || "New"}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {course.students.toLocaleString()}
          </span>
          <span>{course.lessons.length} lessons</span>
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
  course: Course;
  progress: number;
  lessonsCompleted: number;
  lastLesson: string;
  href: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="aspect-[16/7] bg-muted overflow-hidden relative">
        <img
          src={unsplash(course.thumbId, 640, 280)}
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
        <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
        <div className="mt-3">
          <ProgressBar value={progress} />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>
              {lessonsCompleted}/{course.lessons.length} lessons
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

