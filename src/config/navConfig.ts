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
    home: "/admin",
    sections: [
      {
        items: [
          { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
          { label: "Users", to: "/admin/users", icon: Users },
          { label: "Courses", to: "/admin/courses", icon: BookOpen },
          { label: "Blog", to: "/admin/blog", icon: Newspaper },
        ],
      },
      {
        heading: "Platform",
        items: [
          { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
          { label: "Access & Roles", to: "/admin/users", icon: ShieldCheck },
          { label: "Settings", to: "/admin/analytics", icon: Settings },
        ],
      },
    ],
  },
  manager: {
    home: "/manager",
    sections: [
      {
        items: [
          { label: "Dashboard", to: "/manager", icon: LayoutDashboard },
          { label: "Course Library", to: "/manager/courses", icon: LibraryBig },
        ],
      },
      {
        heading: "Authoring",
        items: [
          { label: "Course Builder", to: "/manager/builder", icon: PenSquare },
          { label: "Lesson Editor", to: "/manager/lesson", icon: FileText },
          { label: "Quiz Builder", to: "/manager/quiz", icon: ListChecks },
          { label: "Blog Editor", to: "/manager/blog", icon: Newspaper },
        ],
      },
      {
        heading: "Insight",
        items: [{ label: "Content Progress", to: "/manager/progress", icon: TrendingUp }],
      },
    ],
  },
  instructor: {
    home: "/instructor",
    sections: [
      {
        items: [
          { label: "Dashboard", to: "/instructor", icon: LayoutDashboard },
          { label: "My Courses", to: "/instructor/courses", icon: BookOpen },
        ],
      },
      {
        heading: "Teaching",
        items: [
          { label: "Lessons", to: "/instructor/lessons", icon: FileText },
          { label: "Quizzes", to: "/instructor/quizzes", icon: ListChecks },
          { label: "Student Progress", to: "/instructor/progress", icon: TrendingUp },
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
