'use client';
import { Search } from "lucide-react";

export default function CourseFilter({
  query, statusFilter, instructorFilter, categoryFilter, instructors, cats
}: {
  query: string, statusFilter: string, instructorFilter: string, categoryFilter: string, instructors: string[], cats: string[]
}) {
  return (
    <form className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-border">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          name="q"
          defaultValue={query}
          placeholder="Search courses" 
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-transparent text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" 
        />
      </div>
      <select name="status" defaultValue={statusFilter} onChange={(e) => e.target.form?.submit()} className="h-9 px-3 rounded-lg border border-border bg-card text-sm outline-none">
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
      <select name="instructor" defaultValue={instructorFilter} onChange={(e) => e.target.form?.submit()} className="h-9 px-3 rounded-lg border border-border bg-card text-sm outline-none">
        <option value="all">All instructors</option>
        {instructors.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
      <select name="category" defaultValue={categoryFilter} onChange={(e) => e.target.form?.submit()} className="h-9 px-3 rounded-lg border border-border bg-card text-sm outline-none">
        <option value="all">All categories</option>
        {cats.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <noscript><button type="submit" className="hidden">Filter</button></noscript>
    </form>
  );
}
