import Link from "next/link";
import { Compass } from "lucide-react";
import { Page } from "@/components/Page";
import { DiscoveryCard } from "@/components/CourseCard";
import { Button, EmptyState } from "@/components/ui";
import { getCourses } from "@/lib/services/courseService";
import { fetchWithAuth } from "@/lib/api";

export default async function StudentCoursesPage() {
  const publishedCourses = await getCourses();
  
  // Fetch enrollments to determine progress mapping
  let enrolled: any[] = [];
  try {
    const res = await fetchWithAuth('/api/enrollments?populate=course');
    if (res.ok) {
      const data = await res.json();
      enrolled = data.data || [];
    }
  } catch (e) {}

  const progressMap = enrolled.reduce((acc, curr) => {
    if (curr.course?.documentId) {
      acc[curr.course.documentId] = curr.progressPercentage || 0;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <Page title="Course Library" subtitle="Discover new skills and knowledge.">
      <div className="flex items-center gap-4 mb-6 text-sm">
        <button className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-medium">All Courses</button>
        <button className="text-gray-500 hover:text-gray-900 font-medium">Data Science</button>
        <button className="text-gray-500 hover:text-gray-900 font-medium">Programming</button>
      </div>
      
      {publishedCourses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publishedCourses.map((course) => (
            <DiscoveryCard
              key={course.documentId}
              course={course as any}
              href={`/courses/${course.slug || course.documentId}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Compass size={24} />}
          title="No courses available"
          description="There are currently no published courses in the library."
        />
      )}
    </Page>
  );
}
