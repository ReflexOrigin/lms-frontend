"use client";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Page } from "@/components/Page";
import { courses, myLearning } from "@/data";
import { Button, EmptyState } from "@/components/ui";
import { LearningCard } from "@/components/CourseCard";
import { useLearn } from "@/contexts/LearnContext";

export default function StudentMyCourses() {
  const { enrolled, progressFor, completedCount } = useLearn();
  const list = courses.filter((c) => enrolled.has(c.id));

  return (
    <Page title="My Courses" subtitle={`${list.length} enrolled courses`}>
      {list.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((c) => {
            const meta = myLearning.find((m) => m.courseId === c.id);
            return (
              <LearningCard
                key={c.id}
                course={c}
                progress={progressFor(c.id)}
                lessonsCompleted={completedCount(c.id)}
                lastLesson={meta?.lastLesson ?? c.lessons[0].title}
                href={`/student/learn/${c.slug}`}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Compass size={24} />}
          title="No courses yet"
          description="Explore the catalog and enroll in your first course to start learning."
          action={
            <Link href="/student/explore">
              <Button>Explore courses</Button>
            </Link>
          }
        />
      )}
    </Page>
  );
}

