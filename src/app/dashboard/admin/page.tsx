import { BookOpen, FileText, GraduationCap, Newspaper, ShieldCheck, UserCog, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { Page } from "@/components/Page";
import { Avatar, Badge, Button, Card, CardHeader, StatCard, StatusPill } from "@/components/ui";
import { DonutChart, LineChart } from "@/components/charts";
import { fetchWithAuth } from "@/lib/api";

const activityIcon: Record<string, typeof Users> = {
  user: UserPlus,
  course: BookOpen,
  blog: Newspaper,
  enroll: GraduationCap,
  quiz: FileText,
};

export default async function AdminDashboard() {
  let courses: any[] = [];
  let users: any[] = [];
  let enrollments: any[] = [];
  let blogs: any[] = [];
  
  try {
    const [coursesRes, usersRes, enrollmentsRes, blogsRes] = await Promise.all([
      fetchWithAuth('/api/courses?populate=instructor,lessons'),
      fetchWithAuth('/api/users?populate=role'),
      fetchWithAuth('/api/enrollments'),
      fetchWithAuth('/api/blog-posts').catch(() => ({ ok: false, json: () => ({ data: [] }) }))
    ]);

    if (coursesRes.ok) courses = (await coursesRes.json()).data || [];
    if (usersRes.ok) users = await usersRes.json();
    if (enrollmentsRes.ok) enrollments = (await enrollmentsRes.json()).data || [];
    if (blogsRes.ok) blogs = (await blogsRes.json()).data || [];
  } catch (error) {
    console.error("Failed to fetch admin data", error);
  }

  const publishedCourses = courses.filter((c) => c.publishedAt).length;

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
  
  // Generate the last 6 months for the trend chart
  const currentMonthIdx = new Date().getMonth();
  const enrollmentTrend: { label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(currentMonthIdx - i);
    enrollmentTrend.push({ label: d.toLocaleString('default', { month: 'short' }), value: 0 });
  }

  // Populate actual enrollment counts
  enrollments.forEach(e => {
    const date = new Date(e.enrolledAt || e.createdAt || new Date());
    const month = date.toLocaleString('default', { month: 'short' });
    const trendItem = enrollmentTrend.find(t => t.label === month);
    if (trendItem) {
      trendItem.value += 1;
    }
  });

  const recentActivity = [
    { id: '1', kind: 'user', text: `${users[users.length-1]?.username || 'A new user'} joined the platform.`, time: 'Recently' },
    { id: '2', kind: 'course', text: `${courses[courses.length-1]?.title || 'A new course'} was updated.`, time: 'Recently' }
  ];

  return (
    <Page
      title="Platform Overview"
      subtitle="Full visibility across users, content, and activity."
      actions={
        <>
          <Link href="/dashboard/admin/users">
            <Button variant="outline">
              <UserCog size={16} /> Manage users
            </Button>
          </Link>
          <Link href="/dashboard/admin/analytics">
            <Button>
              <ShieldCheck size={16} /> Platform analytics
            </Button>
          </Link>
        </>
      }
    >
      {/* Primary KPIs — platform health first */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={users.length.toLocaleString()} delta={{ value: "Live Data", up: true }} icon={<Users size={16} />} accentIcon />
        <StatCard label="Total Courses" value={courses.length} delta={{ value: `${publishedCourses} published`, up: true }} icon={<BookOpen size={16} />} />
        <StatCard label="Total Enrollments" value={enrollments.length.toLocaleString()} delta={{ value: "Live Data", up: true }} icon={<GraduationCap size={16} />} />
        <StatCard label="Active Learners" value={roleCounts.students.toLocaleString()} delta={{ value: "Live Data", up: true }} icon={<Users size={16} />} />
      </div>

      {/* Role breakdown strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
        {[
          { l: "Students", v: roleCounts.students, c: "#2563eb" },
          { l: "Instructors", v: roleCounts.instructors, c: "#0d9488" },
          { l: "Content Managers", v: roleCounts.contentManagers, c: "#7c3aed" },
          { l: "Administrators", v: roleCounts.admins, c: "#4f46e5" },
          { l: "Blog Posts", v: blogs.length, c: "#d97706" },
        ].map((s) => (
          <Card key={s.l} className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: s.c }} />
              <span className="text-xs text-muted-foreground">{s.l}</span>
            </div>
            <div className="text-xl font-semibold mt-1 tabular-nums">{s.v.toLocaleString()}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-4 mt-4">
        <Card className="lg:col-span-3">
          <CardHeader title="Enrollment Trend" subtitle="Monthly enrollments (Sample Data)" />
          <div className="px-3 pb-4 pt-2">
            <LineChart data={enrollmentTrend} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="User Distribution" subtitle="By assigned role" />
          <div className="px-5 py-6">
            <DonutChart data={userDistribution} />
          </div>
        </Card>
      </div>

      {/* Course activity + recent activity */}
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader
            title="Course Activity"
            subtitle="Top courses across all instructors"
            action={
              <Link href="/dashboard/admin/courses">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            }
          />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-y border-border">
                  <th className="font-medium px-5 py-2.5">Course</th>
                  <th className="font-medium px-3 py-2.5">Instructor</th>
                  <th className="font-medium px-3 py-2.5 text-right">Students</th>
                  <th className="font-medium px-3 py-2.5">Completion</th>
                  <th className="font-medium px-5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? courses.slice(0, 5).map((c) => {
                  const completion = c.completion || 0;
                  return (
                    <tr key={c.documentId} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3 font-medium">{c.title}</td>
                      <td className="px-3 py-3 text-muted-foreground">{c.instructor?.username || 'System'}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{c.students || 0}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full accent-bg rounded-full" style={{ width: `${completion}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground">{completion}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusPill status={c.publishedAt ? 'published' : 'draft'} />
                      </td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No courses available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Platform Activity" />
          <ul className="px-5 py-4 space-y-4">
            {recentActivity.map((a) => {
              const Icon = activityIcon[a.kind] ?? Users;
              return (
                <li key={a.id} className="flex gap-3">
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </Page>
  );
}

