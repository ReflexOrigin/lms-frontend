import AppShell from "@/components/layout/AppShell";

export default function ManagerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="manager">
      {children}
    </AppShell>
  );
}
