import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Page } from "@/components/Page";
import { Avatar, Badge, Button, Card, CardHeader, ProgressBar } from "@/components/ui";
import { LearningCard } from "@/components/CourseCard";
import { getCurrentUser } from "@/lib/services/userService";
import { fetchWithAuth } from "@/lib/api";

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  
  // Fetch enrollments for the student
  let enrolled: any[] = [];
  try {
    const res = await fetchWithAuth('/api/enrollments?populate=course');
    if (res.ok) {
      const data = await res.json();
      enrolled = data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch enrollments", error);
  }

  const feature = enrolled.length > 0 ? enrolled[0] : null;

  return (
    <Page title={`Welcome back, ${user?.username || 'Student'}`} subtitle="Pick up where you left off.">
      {/* Continue learning hero */}
      {feature ? (
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="aspect-[16/10] md:aspect-auto bg-muted relative">
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 font-medium">Course Thumbnail</span>
              </div>
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <Badge tone="accent">
                <Sparkles size={13} /> Continue learning
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight mt-3">{feature.course?.title || 'Untitled Course'}</h2>
              <div className="mt-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Your progress</span>
                  <span className="font-semibold tabular-nums">{feature.progressPercentage || 0}%</span>
                </div>
                <ProgressBar value={feature.progressPercentage || 0} height={10} />
              </div>
              <Link href={`/courses/${feature.course?.slug || feature.course?.documentId}`} className="mt-6">
                <Button size="lg">
                  <Play size={16} /> Continue lesson
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center bg-blue-50 border-blue-100 border-dashed">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No active enrollments</h3>
          <p className="text-blue-700/80 mb-6">You haven't enrolled in any courses yet. Explore the library to start learning.</p>
          <Link href="/dashboard/student/explore">
            <Button>Browse Courses</Button>
          </Link>
        </Card>
      )}

      {/* My courses */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-lg font-semibold tracking-tight">My courses</h2>
        <Link href="/dashboard/student/courses" className="text-sm font-medium accent-text flex items-center gap-1">
          View all <ArrowRight size={15} />
        </Link>
      </div>
      
      {enrolled.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolled.map((m: any) => (
            <LearningCard
              key={m.documentId}
              course={m.course}
              progress={m.progressPercentage || 0}
              lessonsCompleted={0}
              lastLesson={"Next Lesson"}
              href={`/courses/${m.course?.slug || m.course?.documentId}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">No courses to display.</div>
      )}

      {/* Recent quizzes + activity */}
      <div className="grid lg:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader
            title="Recent Quiz Results"
            action={
              <Link href="/dashboard/student/quizzes">
                <Button variant="ghost" size="sm">
                  All quizzes
                </Button>
              </Link>
            }
          />
          <div className="p-8 text-center text-sm text-gray-500">
            No quiz results yet.
          </div>
        </Card>

        <Card>
          <CardHeader title="Learning Activity" />
          <div className="p-8 text-center text-sm text-gray-500">
            No recent activity.
          </div>
        </Card>
      </div>
    </Page>
  );
}


