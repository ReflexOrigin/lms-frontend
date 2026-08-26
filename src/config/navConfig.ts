import {
  BarChart3,
  BookOpen,
  Compass,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LibraryBig,
  ListChecks,
  Newspaper,
  PenSquare,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "../data";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}
export interface NavSection {
  heading?: string;
  items: NavItem[];
}

// Each role gets a deliberately different information architecture, not a
// relabeled copy of the same sidebar.
export const navConfig: Record<Role, { home: string; sections: NavSection[] }> = {
  admin: {
    home: "/dashboard/admin",
    sections: [
      {
        items: [
          { label: "Dashboard", to: "/dashboard/admin", icon: LayoutDashboard },
          { label: "Users", to: "/dashboard/admin/users", icon: Users },
          { label: "Courses", to: "/dashboard/admin/courses", icon: BookOpen },
          { label: "Blog", to: "/dashboard/admin/blog", icon: Newspaper },
        ],
      },
      {
        heading: "Platform",
        items: [
          { label: "Analytics", to: "/dashboard/admin/analytics", icon: BarChart3 },
          { label: "Access & Roles", to: "/dashboard/admin/users", icon: ShieldCheck },
          { label: "Settings", to: "/dashboard/admin/analytics", icon: Settings },
        ],
      },
    ],
  },
  manager: {
    home: "/dashboard/manager",
    sections: [
      {
        items: [
          { label: "Dashboard", to: "/dashboard/manager", icon: LayoutDashboard },
          { label: "Course Library", to: "/dashboard/manager/courses", icon: LibraryBig },
        ],
      },
      {
        heading: "Authoring",
        items: [
          { label: "Course Builder", to: "/dashboard/manager/builder", icon: PenSquare },
          { label: "Lesson Editor", to: "/dashboard/manager/lesson", icon: FileText },
          { label: "Quiz Builder", to: "/dashboard/manager/quiz", icon: ListChecks },
          { label: "Blog Editor", to: "/dashboard/manager/blog", icon: Newspaper },
        ],
      },
      {
        heading: "Insight",
        items: [{ label: "Content Progress", to: "/dashboard/manager/progress", icon: TrendingUp }],
      },
    ],
  },
  instructor: {
    home: "/dashboard/instructor",
    sections: [
      {
        items: [
          { label: "Dashboard", to: "/dashboard/instructor", icon: LayoutDashboard },
          { label: "My Courses", to: "/dashboard/instructor/courses", icon: BookOpen },
        ],
      },
      {
        heading: "Teaching",
        items: [
          { label: "Lessons", to: "/dashboard/instructor/lessons", icon: FileText },
          { label: "Quizzes", to: "/dashboard/instructor/quizzes", icon: ListChecks },
          { label: "Student Progress", to: "/dashboard/instructor/progress", icon: TrendingUp },
        ],
      },
    ],
  },
  student: {
    home: "/dashboard/student",
    sections: [
      {
        items: [
          { label: "Home", to: "/dashboard/student", icon: Home },
          { label: "Explore Courses", to: "/dashboard/student/explore", icon: Compass },
          { label: "My Courses", to: "/dashboard/student/courses", icon: GraduationCap },
          { label: "Progress", to: "/dashboard/student/progress", icon: TrendingUp },
          { label: "Quizzes", to: "/dashboard/student/quizzes", icon: ListChecks },
          { label: "Blog", to: "/blog", icon: Newspaper },
        ],
      },
    ],
  },
};
