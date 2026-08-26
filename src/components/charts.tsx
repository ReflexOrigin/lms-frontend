"use client";
"use client";

// Lightweight, dependency-free SVG charts tuned for the LMS dashboards.

export function DonutChart({
  data,
  size = 168,
  thickness = 22,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((d) => {
            const frac = d.value / total;
            const dash = frac * c;
            const el = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return el;
          })}
        </g>
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: 22, fontWeight: 700 }}
        >
          {total.toLocaleString()}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: 11 }}
        >
          total
        </text>
      </svg>
      <ul className="space-y-2.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2.5 text-sm">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
            <span className="text-muted-foreground w-32">{d.label}</span>
            <span className="font-semibold tabular-nums">{d.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineChart({
  data,
  height = 200,
  color = "var(--accent, #4f46e5)",
}: {
  data: { month: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const w = 640;
  const pad = { t: 16, r: 16, b: 28, l: 40 };
  const max = Math.max(1, ...data.map((d) => d.value)) * 1.1;
  const iw = w - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / (data.length - 1)) * iw;
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`).join(" ");
  const area = `${line} L ${x(data.length - 1)} ${pad.t + ih} L ${x(0)} ${pad.t + ih} Z`;
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => {
        const gy = y(t);
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={gy} y2={gy} stroke="var(--color-border)" strokeWidth={1} />
            <text x={pad.l - 8} y={gy + 4} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 10 }}>
              {t.toLocaleString()}
            </text>
          </g>
        );
      })}
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r={3.5} fill="var(--color-card)" stroke={color} strokeWidth={2} />
          <text x={x(i)} y={height - 8} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
            {d.label || d.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function BarChart({
  data,
  height = 180,
  color = "var(--accent, #4f46e5)",
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="text-xs font-semibold tabular-nums">{d.value}</span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{ height: `${(d.value / max) * 100}%`, background: color, minHeight: 4 }}
          />
          <span className="text-[11px] text-muted-foreground text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// Horizontal distribution meter (for progress buckets etc.)
export function StackedBar({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-muted">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-semibold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

