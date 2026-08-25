"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { courses, myLearning } from "../data";

interface QuizResult {
  quizId: string;
  title: string;
  course: string;
  score: number;
  correct: number;
  total: number;
  date: string;
}

interface LearnState {
  enrolled: Set<string>;
  completed: Record<string, Set<string>>; // courseId -> completed lesson ids
  results: QuizResult[];
  enroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  toggleLesson: (courseId: string, lessonId: string) => void;
  isComplete: (courseId: string, lessonId: string) => boolean;
  progressFor: (courseId: string) => number;
  completedCount: (courseId: string) => number;
  recordResult: (r: QuizResult) => void;
}

const Ctx = createContext<LearnState | null>(null);

// Seed initial enrolled courses + partial completion so the dashboards look alive.
function seedCompleted(): Record<string, Set<string>> {
  const map: Record<string, Set<string>> = {};
  for (const m of myLearning) {
    const c = courses.find((x) => x.id === m.courseId);
    if (!c) continue;
    map[m.courseId] = new Set(c.lessons.slice(0, m.lessonsCompleted).map((l) => l.id));
  }
  return map;
}

export function LearnProvider({ children }: { children: ReactNode }) {
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set(myLearning.map((m) => m.courseId)));
  const [completed, setCompleted] = useState<Record<string, Set<string>>>(seedCompleted);
  const [results, setResults] = useState<QuizResult[]>([]);

  const value = useMemo<LearnState>(() => {
    const completedCount = (courseId: string) => completed[courseId]?.size ?? 0;
    const progressFor = (courseId: string) => {
      const c = courses.find((x) => x.id === courseId);
      if (!c) return 0;
      return Math.round((completedCount(courseId) / c.lessons.length) * 100);
    };
    return {
      enrolled,
      completed,
      results,
      enroll: (courseId) => setEnrolled((s) => new Set(s).add(courseId)),
      isEnrolled: (courseId) => enrolled.has(courseId),
      toggleLesson: (courseId, lessonId) =>
        setCompleted((prev) => {
          const set = new Set(prev[courseId] ?? []);
          set.has(lessonId) ? set.delete(lessonId) : set.add(lessonId);
          return { ...prev, [courseId]: set };
        }),
      isComplete: (courseId, lessonId) => completed[courseId]?.has(lessonId) ?? false,
      progressFor,
      completedCount,
      recordResult: (r) => setResults((rs) => [r, ...rs]),
    };
  }, [enrolled, completed, results]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLearn() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLearn must be used within LearnProvider");
  return ctx;
}

