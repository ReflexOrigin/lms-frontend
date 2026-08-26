import { GraduationCap } from "lucide-react";
import { Page } from "@/components/Page";
import { LearningCard } from "@/components/CourseCard";
import { EmptyState } from "@/components/ui";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui";

export default async function MyCoursesPage() {
  let enrolled: any[] = [];
  try {
    const res = await fetchWithAuth('/api/enrollments?populate[course][populate][0]=instructor&populate[course][populate][1]=lessons');
    if (res.ok) {
      const data = await res.json();
      enrolled = data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch enrollments", error);
  }

  return (
    <Page title="My Courses" subtitle="Continue your learning journey.">
      {enrolled.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrolled.map((m: any) => {
            const lessonCount = m.course?.lessons?.length || 0;
            const progress = m.progressPercentage || 0;
            const completedCount = Math.round((progress / 100) * lessonCount);
            
            return (
              <LearningCard
                key={m.documentId}
                course={m.course}
                progress={progress}
                lessonsCompleted={completedCount}
                lastLesson={"Next Lesson"}
                href={`/courses/${m.course?.slug || m.course?.documentId}`}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<GraduationCap size={24} />}
          title="No courses yet"
          description="You haven't enrolled in any courses. Check out the library to get started!"
          action={
            <Link href="/dashboard/student/explore">
              <Button>Explore Courses</Button>
            </Link>
          }
        />
      )}
    </Page>
  );
}
