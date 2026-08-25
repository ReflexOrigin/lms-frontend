import AppShell from "@/components/layout/AppShell";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="admin">
      {children}
    </AppShell>
  );
}
