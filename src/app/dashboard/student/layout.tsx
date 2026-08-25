import { LearnProvider } from "@/contexts/LearnContext";
import AppShell from "@/components/layout/AppShell";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LearnProvider>
      <AppShell role="student">
        {children}
      </AppShell>
    </LearnProvider>
  );
}
