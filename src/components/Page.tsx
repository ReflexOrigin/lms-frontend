import React from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui";

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
export function Page({
  title,
  subtitle,
  actions,
  children,
  max = "max-w-[1200px]",
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  max?: string;
}) {
  return (
    <div className={cx("mx-auto w-full px-4 lg:px-8 py-6 lg:py-8 animate-in", max)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function NewButton({ label }: { label: string }) {
  return (
    <Button>
      <Plus size={16} /> {label}
    </Button>
  );
}
