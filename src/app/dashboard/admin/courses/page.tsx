"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, Filter, Pencil, Search, Trash2 } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import { courses } from "@/data";
import { Button, Card, Input, Select, StatusPill } from "@/components/ui";

export default function AdminCourses() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [instructor, setInstructor] = useState("all");
  const [category, setCategory] = useState("all");

  const instructors = Array.from(new Set(courses.map((c) => c.instructor)));
  const cats = Array.from(new Set(courses.map((c) => c.category)));

  let list = courses;
  if (status !== "all") list = list.filter((c) => c.status === status);
  if (instructor !== "all") list = list.filter((c) => c.instructor === instructor);
  if (category !== "all") list = list.filter((c) => c.category === category);
  if (query) list = list.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <Page
      title="Course Management"
      subtitle="Every course on the platform, across all instructors."
      actions={<NewButton label="Create course" />}
    >
      <Card className="overflow-hidden">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-border">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </Select>
          <Select value={instructor} onChange={(e) => setInstructor(e.target.value)}>
            <option value="all">All instructors</option>
            {instructors.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                <th className="font-medium px-5 py-3">Course</th>
                <th className="font-medium px-3 py-3">Instructor</th>
                <th className="font-medium px-3 py-3 text-right">Lessons</th>
                <th className="font-medium px-3 py-3 text-right">Students</th>
                <th className="font-medium px-3 py-3">Completion</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="font-medium px-3 py-3">Updated</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <Link href={`/admin/courses/${c.slug}`} className="font-medium hover:accent-text">
                      {c.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">{c.category}</div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{c.instructor}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.lessons.length}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.students.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full accent-bg rounded-full" style={{ width: `${c.completion}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">{c.completion}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{c.updated}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <Link href={`/admin/courses/${c.slug}`} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                        <Eye size={16} />
                      </Link>
                      <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                        <Pencil size={16} />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] flex items-center justify-center">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {list.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
          <Filter size={15} /> No courses match these filters.
        </div>
      )}
    </Page>
  );
}

