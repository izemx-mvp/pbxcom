import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Signature motif — thin circuit traces with round nodes, a light pulse travelling along them.
 * Paths are hand-tuned for a 1200×600 viewBox and scale with preserveAspectRatio="none" off.
 */
const TRACE_SETS: Record<"hero" | "wide" | "corner", string[]> = {
  hero: [
    "M0 120 H220 L260 160 H520 L560 120 H760",
    "M0 300 H140 L180 260 H420 L470 310 H640 L690 260 H900",
    "M0 460 H260 L300 500 H560",
    "M1200 80 H1010 L970 120 H840",
    "M1200 380 H1060 L1020 420 H880 L840 380 H760",
    "M1200 540 H960 L920 500 H700",
    "M560 0 V60 L600 100 V200",
    "M820 600 V520 L780 480 V420",
  ],
  wide: [
    "M0 80 H300 L340 120 H700 L740 80 H1200",
    "M0 200 H180 L220 240 H520 L560 200 H860 L900 240 H1200",
    "M0 320 H420 L460 280 H760 L800 320 H1200",
  ],
  corner: ["M1200 40 H980 L940 80 H760", "M1200 160 H1040 L1000 200 H900 L860 160 H700", "M1200 280 H1100 L1060 320 H960"],
};

function endpoints(d: string): Array<[number, number]> {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  // first point
  const pts: Array<[number, number]> = [];
  if (nums.length >= 2) pts.push([nums[0]!, nums[1]!]);
  // walk commands to find last point
  const tokens = d.match(/[MLHV]|-?\d+(\.\d+)?/g) ?? [];
  let x = 0;
  let y = 0;
  let cmd = "M";
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (/[MLHV]/.test(t)) {
      cmd = t;
      continue;
    }
    if (cmd === "M" || cmd === "L") {
      x = Number(t);
      y = Number(tokens[++i]);
    } else if (cmd === "H") x = Number(t);
    else if (cmd === "V") y = Number(t);
  }
  pts.push([x, y]);
  return pts;
}

export function CircuitLines({
  variant = "hero",
  className,
  opacity = 0.5,
  animated = true,
  color = "var(--green)",
}: {
  variant?: keyof typeof TRACE_SETS;
  className?: string;
  opacity?: number;
  animated?: boolean;
  color?: string;
}) {
  const id = useId().replace(/:/g, "");
  const paths = TRACE_SETS[variant];
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={`pulse-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="var(--green-bright)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--green-bright)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--green-bright)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {animated && (
            <path
              d={d}
              fill="none"
              stroke="var(--green-bright)"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="circuit-pulse"
              style={{ animationDelay: `${i * 0.9}s`, animationDuration: `${5 + (i % 3) * 1.5}s` }}
            />
          )}
          {endpoints(d).map(([cx, cy], j) => (
            <circle key={j} cx={cx} cy={cy} r={3} fill="var(--ink)" stroke={color} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function CircuitDivider({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const stroke = tone === "dark" ? "var(--green)" : "var(--green-deep)";
  return (
    <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className={cn("h-6 w-full", className)} aria-hidden>
      <path
        d="M0 12 H420 L432 4 H560 L572 12 H1200"
        fill="none"
        stroke={stroke}
        strokeOpacity={0.35}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 12 H420 L432 4 H560 L572 12 H1200"
        fill="none"
        stroke="var(--green-bright)"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        className="circuit-pulse"
        style={{ animationDuration: "9s" }}
      />
      <circle cx="432" cy="4" r="2.5" fill={stroke} />
      <circle cx="560" cy="4" r="2.5" fill={stroke} />
    </svg>
  );
}

export function GridBackground({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", tone === "dark" ? "bg-dot-grid" : "bg-dot-grid-ink opacity-60", className)}
    />
  );
}

/** Repeating circuit pattern used as a texture (e.g. on the green CTA band, in ink at 10%). */
export function CircuitPattern({ className, color = "var(--ink)", opacity = 0.1 }: { className?: string; color?: string; opacity?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden style={{ opacity }}>
      <defs>
        <pattern id={`cp-${id}`} width="160" height="160" patternUnits="userSpaceOnUse">
          <path d="M0 40 H50 L70 60 H110 L130 40 H160 M40 160 V120 L60 100 V70 M120 0 V30 L100 50 M0 120 H30 L50 140 H90 L110 120 H160" fill="none" stroke={color} strokeWidth="1.2" />
          <circle cx="70" cy="60" r="3" fill={color} />
          <circle cx="130" cy="40" r="3" fill={color} />
          <circle cx="60" cy="100" r="3" fill={color} />
          <circle cx="100" cy="50" r="3" fill={color} />
          <circle cx="110" cy="120" r="3" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#cp-${id})`} />
    </svg>
  );
}

/** Green radial glow behind key elements */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-[radial-gradient(closest-side,oklch(0.775_0.215_133/0.28),transparent)] blur-2xl",
        className,
      )}
    />
  );
}
