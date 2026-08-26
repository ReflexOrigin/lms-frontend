import { Page } from "@/components/Page";
import { Badge, Card, CardHeader, StatCard } from "@/components/ui";
import { BarChart, DonutChart, LineChart, StackedBar } from "@/components/charts";
import { fetchWithAuth } from "@/lib/api";

const categoryEnrollments = [
  { label: "Data Science", value: 5820 },
  { label: "Programming", value: 4210 },
  { label: "Security", value: 1640 },
  { label: "Design", value: 1170 },
];

export default async function AdminAnalytics() {
  let courses: any[] = [];
  let users: any[] = [];
  let enrollments: any[] = [];

  try {
    const [coursesRes, usersRes, enrollmentsRes] = await Promise.all([
      fetchWithAuth('/api/courses?populate=category'),
      fetchWithAuth('/api/users?populate=role'),
      fetchWithAuth('/api/enrollments')
    ]);

    if (coursesRes.ok) courses = (await coursesRes.json()).data || [];
    if (usersRes.ok) users = await usersRes.json();
    if (enrollmentsRes.ok) enrollments = (await enrollmentsRes.json()).data || [];
  } catch (error) {
    console.error("Failed to fetch admin data", error);
  }

  const topCourses = [...courses].sort((a, b) => (b.students || 0) - (a.students || 0)).slice(0, 5);

  const roleCounts = {
    students: users.filter(u => u.role?.name?.toLowerCase() === 'student' || u.role?.name?.toLowerCase() === 'authenticated').length,
    instructors: users.filter(u => u.role?.name?.toLowerCase() === 'instructor').length,
    contentManagers: users.filter(u => u.role?.name?.toLowerCase() === 'manager' || u.role?.name?.toLowerCase() === 'content manager').length,
    admins: users.filter(u => u.role?.name?.toLowerCase() === 'admin' || u.role?.name?.toLowerCase() === 'administrator').length,
  };

  const userDistribution = [
    { label: "Students", value: roleCounts.students, color: "#2563eb" },
    { label: "Instructors", value: roleCounts.instructors, color: "#0d9488" },
    { label: "Managers", value: roleCounts.contentManagers, color: "#7c3aed" },
    { label: "Admins", value: roleCounts.admins, color: "#4f46e5" },
  ].filter(d => d.value > 0);
  
  const enrollmentTrend = [
    { label: "Jan", value: 120 }, { label: "Feb", value: 150 },
    { label: "Mar", value: 180 }, { label: "Apr", value: 220 },
    { label: "May", value: 270 }, { label: "Jun", value: 310 },
    { label: "Jul", value: 380 }, { label: "Aug", value: 450 },
  ];

  const avgCompletion = enrollments.length
    ? Math.round(enrollments.reduce((s, x) => s + (x.progressPercentage || 0), 0) / enrollments.length)
    : 0;

  return (
    <Page title="Platform Analytics" subtitle="Growth, engagement, and content performance.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Active" value={users.length.toLocaleString()} delta={{ value: "Live Data", up: true }} accentIcon />
        <StatCard label="Avg. Completion" value={`${avgCompletion}%`} delta={{ value: "Live Data", up: true }} />
        <StatCard label="Avg. Quiz Score" value="0%" delta={{ value: "No quizzes yet", up: false }} />
        <StatCard label="Retention (30d)" value="99%" delta={{ value: "Estimated", up: true }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Enrollment Growth" subtitle="Trailing 8 months (Sample Trend)" />
          <div className="px-3 pb-4 pt-2">
            <LineChart data={enrollmentTrend} height={240} />
          </div>
        </Card>
        <Card>
          <CardHeader title="User Distribution" />
          <div className="px-5 py-6">
            <DonutChart data={userDistribution} size={150} />
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader title="Enrollments by Category" subtitle="Using Sample Data" />
          <div className="px-5 py-6">
            <BarChart data={categoryEnrollments} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Completion Distribution" subtitle="Across all active enrollments" />
          <div className="px-5 py-8">
            <StackedBar
              segments={[
                { label: "Completed", value: enrollments.filter(e => e.progressPercentage >= 100).length, color: "#16a34a" },
                { label: "In progress", value: enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length, color: "#4f46e5" },
                { label: "Not started", value: enrollments.filter(e => e.progressPercentage === 0).length, color: "#e5e8ee" },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <CardHeader title="Top Courses by Enrollment" />
        <table className="w-full text-sm min-w-[640px] mt-3">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-y border-border">
              <th className="font-medium px-5 py-2.5">Course</th>
              <th className="font-medium px-3 py-2.5 text-right">Students</th>
              <th className="font-medium px-3 py-2.5 text-right">Completion</th>
              <th className="font-medium px-3 py-2.5 text-right">Quiz Avg</th>
              <th className="font-medium px-5 py-2.5 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {topCourses.length > 0 ? topCourses.map((c) => (
              <tr key={c.documentId} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-medium">{c.title}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.students || 0}</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.completion || 0}%</td>
                <td className="px-3 py-3 text-right tabular-nums">{c.quizAvg || 0}%</td>
                <td className="px-5 py-3 text-right tabular-nums">{c.rating || "—"}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No courses available.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

