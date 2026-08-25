import AppShell from "@/components/layout/AppShell";

export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="instructor">
      {children}
    </AppShell>
  );
}
