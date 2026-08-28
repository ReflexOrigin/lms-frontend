import { Page } from "@/components/Page";
import { EmptyState } from "@/components/ui";
import { fetchWithAuth } from "@/lib/api";
import AdminCourseClient from "./AdminCourseClient";

export default async function AdminCourseDetail({ params }: { params: { slug: string } }) {
  const documentId = params.slug;
  let course = null;
  let enrollments = [];

  try {
    const courseRes = await fetchWithAuth(`/api/courses/${documentId}?populate=instructor,lessons,category`);
    if (courseRes.ok) {
      course = (await courseRes.json()).data;
    }

    const enrollmentsRes = await fetchWithAuth(`/api/enrollments?filters[course][documentId][$eq]=${documentId}&populate=student`);
    if (enrollmentsRes.ok) {
      enrollments = (await enrollmentsRes.json()).data || [];
    }
  } catch (error) {
    console.error("Failed to fetch admin course details", error);
  }

  if (!course) {
    return (
      <Page title="Course">
        <EmptyState title="Course not found" />
      </Page>
    );
  }

  return <AdminCourseClient course={course} enrollments={enrollments} />;
}
