"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { AlertTriangle, Check, Inbox, Loader2, RefreshCw, X } from "lucide-react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Button ---------- */
type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none accent-ring select-none";
  const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-[15px]",
  };
  const variants: Record<Variant, string> = {
    primary: "accent-bg text-white hover:brightness-110 shadow-sm",
    secondary: "bg-muted text-foreground hover:bg-border/70",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
    outline: "border border-border bg-card text-foreground hover:bg-muted",
    danger: "bg-danger text-white hover:brightness-110 shadow-sm",
  };
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/* ---------- Card ---------- */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("bg-card border border-border rounded-2xl shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex items-start justify-between gap-4 px-5 pt-5", className)}>
      <div>
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Badge / StatusPill ---------- */
type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";
const toneMap: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
  accent: "accent-soft-bg accent-text",
};

export function Badge({
  tone = "neutral",
  children,
  dot,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        toneMap[tone],
        className,
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const statusTone: Record<string, Tone> = {
  published: "success",
  active: "success",
  completed: "success",
  draft: "warning",
  invited: "info",
  archived: "neutral",
  suspended: "danger",
  locked: "neutral",
};

export function StatusPill({ status }: { status: string }) {
  const tone = statusTone[status.toLowerCase()] ?? "neutral";
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({
  name,
  tone = "#4f46e5",
  size = 36,
}: {
  name: string;
  tone?: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ background: tone, width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({
  value,
  className,
  accent = true,
  height = 8,
}: {
  value: number;
  className?: string;
  accent?: boolean;
  height?: number;
}) {
  return (
    <div
      className={cx("w-full rounded-full bg-muted overflow-hidden", className)}
      style={{ height }}
    >
      <div
        className={cx("h-full rounded-full transition-all duration-500", accent ? "accent-bg" : "bg-[var(--color-success)]")}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ---------- Form controls ---------- */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-foreground mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1.5">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-[10px] border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputCls, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(inputCls, "h-auto py-2.5 leading-relaxed resize-y", props.className)}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(inputCls, "pr-8 cursor-pointer", props.className)} />;
}

/* ---------- Tabs ---------- */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cx(
              "relative px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-1.5 text-xs text-muted-foreground">{t.count}</span>
            )}
            {on && <span className="absolute left-0 right-0 -bottom-px h-0.5 accent-bg rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full animate-in"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 -mr-1 rounded-md hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */
interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}
const ToastCtx = createContext<(message: string, tone?: Tone) => void>(() => {});
export function useToast() {
  return useContext(ToastCtx);
}
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = (message: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, message, tone }]);
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 3200);
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 bg-foreground text-white text-sm px-4 py-3 rounded-xl shadow-xl animate-in"
          >
            <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
              <Check size={13} />
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- States: Skeleton / Empty / Error / Loading ---------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("skeleton rounded-lg", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon ?? <Inbox size={24} />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Unable to load this data.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-danger-soft)] text-[var(--color-danger)] flex items-center justify-center mb-4">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw size={15} /> Retry
        </Button>
      )}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground text-sm">
      <Loader2 className="animate-spin" size={18} /> {label ?? "Loading…"}
    </div>
  );
}

/* ---------- StatCard ---------- */
export function StatCard({
  label,
  value,
  delta,
  icon,
  accentIcon,
}: {
  label: string;
  value: ReactNode;
  delta?: { value: string; up?: boolean };
  icon?: ReactNode;
  accentIcon?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
        {icon && (
          <span
            className={cx(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              accentIcon ? "accent-soft-bg accent-text" : "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      {delta && (
        <div
          className={cx(
            "mt-1 text-xs font-medium",
            delta.up ? "text-[var(--color-success)]" : "text-[var(--color-danger)]",
          )}
        >
          {delta.up ? "▲" : "▼"} {delta.value}
        </div>
      )}
    </Card>
  );
}

