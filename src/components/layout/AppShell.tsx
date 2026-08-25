"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { navConfig } from "@/config/navConfig";
import { roleMeta, type Role } from "@/data";
import { Avatar, Badge, cx } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

export interface Persona {
  role: Role;
  name: string;
  email: string;
  avatarTone: string;
}

export const personas: Record<Role, Persona> = {
  admin: { role: "admin", name: "Omar Faruk", email: "omar.faruk@lumen.edu", avatarTone: "#4f46e5" },
  manager: { role: "manager", name: "Sarah Karim", email: "sarah.karim@lumen.edu", avatarTone: "#7c3aed" },
  instructor: { role: "instructor", name: "Aisha Rahman", email: "aisha.rahman@lumen.edu", avatarTone: "#0d9488" },
  student: { role: "student", name: "Alex Morgan", email: "alex.morgan@lumen.edu", avatarTone: "#2563eb" },
};

function Sidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const cfg = navConfig[role];
  const meta = roleMeta[role];
  const persona = personas[role];
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div className="w-8 h-8 rounded-lg accent-bg flex items-center justify-center text-white">
          <GraduationCap size={18} />
        </div>
        <div>
          <div className="font-semibold text-[15px] leading-none">Lumen</div>
          <div className="text-[11px] text-muted-foreground mt-1">{meta.label} workspace</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {cfg.sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.heading}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.to === cfg.home ? pathname === item.to : pathname?.startsWith(item.to);
                return (
                  <Link
                    key={item.label + item.to}
                    href={item.to}
                    onClick={onNavigate}
                    className={cx(
                      "flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "accent-soft-bg accent-text"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Avatar name={persona.name} tone={persona.avatarTone} size={34} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{persona.name}</div>
            <div className="text-xs text-muted-foreground truncate">{persona.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function crumbsFor(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((p) =>
    p
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/^\w{6,}$/, (s) => s)
  );
}

export default function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = roleMeta[role];
  const crumbs = crumbsFor(pathname || "");
  const persona = personas[role];

  return (
    <div data-role={role} className="h-full flex bg-background w-full absolute inset-0 z-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card">
        <Sidebar role={role} />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border shadow-xl animate-in">
            <button
              onClick={() => setDrawer(false)}
              className="absolute right-3 top-4 text-muted-foreground p-1"
            >
              <X size={18} />
            </button>
            <Sidebar role={role} onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-border bg-card/80 backdrop-blur flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
          <button className="lg:hidden text-muted-foreground" onClick={() => setDrawer(true)}>
            <Menu size={20} />
          </button>

          <nav className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
            {crumbs.length === 0 ? (
              <span className="text-foreground font-medium">Home</span>
            ) : (
              crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5 truncate">
                  {i > 0 && <span className="text-border">/</span>}
                  <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>
                    {c}
                  </span>
                </span>
              ))
            )}
          </nav>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg bg-muted text-muted-foreground text-sm w-56">
            <Search size={16} />
            <input
              placeholder="Search…"
              className="bg-transparent outline-none w-full placeholder:text-muted-foreground/70 text-foreground"
            />
          </div>

          <button className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger ring-2 ring-card" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg hover:bg-muted transition-colors border border-transparent focus:border-border outline-none"
            >
              <Avatar name={persona.name} tone={persona.avatarTone} size={30} />
              <span className="hidden sm:block">
                <Badge tone="accent">{meta.label}</Badge>
              </span>
              <ChevronDown size={15} className="text-muted-foreground" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-xl shadow-xl z-50 py-2 animate-in">
                  <div className="px-4 py-2 border-b border-border mb-2">
                    <p className="font-semibold text-foreground truncate text-sm">{persona.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{persona.email}</p>
                    <p className="text-xs accent-text font-semibold mt-1 uppercase tracking-wider">{meta.label}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-muted text-left transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
