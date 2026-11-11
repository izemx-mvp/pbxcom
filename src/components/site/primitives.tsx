import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { CircuitDivider } from "./circuit";

type Tone = "dark" | "light" | "white" | "green";

const toneClass: Record<Tone, string> = {
  dark: "surface-dark",
  light: "bg-paper text-ink",
  white: "bg-white text-ink",
  green: "bg-green text-ink",
};

export function Section({
  tone = "light",
  divider = false,
  className,
  containerClassName,
  wide,
  children,
  id,
  noPad,
  ...rest
}: {
  tone?: Tone;
  divider?: boolean;
  className?: string;
  containerClassName?: string;
  wide?: boolean;
  children: ReactNode;
  id?: string;
  noPad?: boolean;
  "aria-labelledby"?: string;
}) {
  return (
    <section id={id} className={cn("relative isolate", toneClass[tone], !noPad && "section-pad", className)} {...rest}>
      {divider && <CircuitDivider tone={tone === "dark" ? "dark" : "light"} className="absolute inset-x-0 top-0" />}
      <div className={cn(wide ? "container-wide" : "container-site", containerClassName)}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className, tone = "auto" }: { children: ReactNode; className?: string; tone?: "auto" | "deep" }) {
  return (
    <p
      className={cn(
        "label-mono inline-flex items-center gap-2.5",
        tone === "deep" ? "text-green-deep" : "text-green",
        className,
      )}
    >
      <span className="relative inline-flex size-1.5 rounded-full bg-current animate-pulse-dot" aria-hidden />
      {children}
    </p>
  );
}

/** Highlights the first occurrence of `highlight` inside `title` in green. */
export function Highlight({ title, highlight, tone = "dark" }: { title: string; highlight?: string | undefined; tone?: "dark" | "light" }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const [before, ...after] = title.split(highlight);
  return (
    <>
      {before}
      <span className={tone === "dark" ? "text-green" : "text-green-deep"}>{highlight}</span>
      {after.join(highlight)}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "left",
  tone = "light",
  as: As = "h2",
  className,
  id,
  action,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        action && align === "left" && "md:flex-row md:items-end md:justify-between",
        "mb-12 md:mb-16",
        className,
      )}
    >
      <div className={cn("flex max-w-3xl flex-col gap-5", align === "center" && "items-center")}>
        {eyebrow && <Eyebrow tone={tone === "light" ? "deep" : "auto"}>{eyebrow}</Eyebrow>}
        <As id={id} className={cn(As === "h1" ? "type-h1" : "type-h2", tone === "dark" ? "text-white" : "text-ink")}>
          <Highlight title={title} highlight={highlight} tone={tone} />
        </As>
        {subtitle && (
          <p className={cn("type-lead max-w-[62ch]", tone === "dark" ? "text-white/65" : "text-mute")}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Badge({
  children,
  tone = "green",
  className,
}: {
  children: ReactNode;
  tone?: "green" | "ink" | "outline" | "outline-dark" | "red";
  className?: string;
}) {
  const tones = {
    green: "bg-green text-ink",
    ink: "bg-ink text-white",
    outline: "border border-ink/15 text-ink bg-white",
    "outline-dark": "border border-white/15 text-white/80 bg-white/[0.04]",
    red: "bg-[#E5484D] text-white",
  };
  return (
    <span className={cn("label-mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Chip({
  children,
  active,
  tone = "light",
  className,
  icon,
}: {
  children: ReactNode;
  active?: boolean;
  tone?: "light" | "dark";
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium transition-colors",
        tone === "dark"
          ? active
            ? "border-green bg-green text-ink"
            : "border-white/12 bg-white/[0.04] text-white/80"
          : active
            ? "border-ink bg-ink text-white"
            : "border-ink/10 bg-white text-ink/80",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

type IconType = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number | string }>;

export function IconTile({
  icon: Icon,
  size = "md",
  tone = "dark",
  className,
}: {
  icon: IconType;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
  className?: string;
}) {
  const sizes = { sm: "size-9 rounded-lg [&>svg]:size-4", md: "size-12 rounded-xl [&>svg]:size-5", lg: "size-14 rounded-2xl [&>svg]:size-6" };
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center transition-[box-shadow,background-color,color] duration-200",
        tone === "dark"
          ? "bg-graphite text-green shadow-[inset_0_0_0_1px_oklch(1_0_0/0.07)] group-hover:shadow-[inset_0_0_0_1px_oklch(0.775_0.215_133/0.5),0_0_24px_-4px_oklch(0.775_0.215_133/0.45)]"
          : "bg-ink text-green group-hover:shadow-[0_0_24px_-6px_oklch(0.775_0.215_133/0.6)]",
        sizes[size],
        className,
      )}
    >
      <Icon strokeWidth={1.5} aria-hidden />
    </span>
  );
}

export function PriceTag({
  price,
  oldPrice,
  size = "md",
  tone = "light",
  className,
}: {
  price: number | null;
  oldPrice?: number | undefined;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
}) {
  const sizes = { sm: "text-base", md: "text-lg", lg: "text-3xl md:text-4xl" };
  if (price === null) {
    return (
      <div className={cn("flex flex-col", className)}>
        <span className={cn("font-display font-semibold", sizes[size], tone === "dark" ? "text-white" : "text-ink")}>
          Prix sur demande
        </span>
        <span className={cn("label-mono text-[10px]", tone === "dark" ? "text-green" : "text-green-deep")}>Devis personnalisé</span>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-display font-semibold tabular-nums tracking-tight", sizes[size], tone === "dark" ? "text-white" : "text-ink")}>
        {formatPrice(price)}
      </span>
      <span className={cn("label-mono text-[10px]", tone === "dark" ? "text-white/50" : "text-mute")}>TTC</span>
      {oldPrice && oldPrice > price && (
        <span className={cn("text-sm tabular-nums line-through", tone === "dark" ? "text-white/40" : "text-mute")}>
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  );
}

export function StockDot({ stock, className }: { stock: number; className?: string }) {
  const state = stock === 0 ? "out" : stock < 6 ? "low" : "in";
  const label = state === "out" ? "Sur commande" : state === "low" ? `Plus que ${stock} en stock` : "En stock";
  return (
    <span className={cn("inline-flex items-center gap-2 text-[13px]", className)}>
      <span
        className={cn(
          "size-2 rounded-full",
          state === "in" && "bg-green animate-pulse-dot",
          state === "low" && "bg-[#F5A524]",
          state === "out" && "bg-mute",
        )}
        aria-hidden
      />
      <span className={state === "out" ? "text-mute" : ""}>{label}</span>
    </span>
  );
}

export function StatCard({
  value,
  label,
  description,
  className,
}: {
  value: ReactNode;
  label: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[14px] bg-graphite p-7 hairline-dark", className)}>
      <div className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl">{value}</div>
      <div className="label-mono mt-4 text-green">{label}</div>
      {description && <p className="mt-3 max-w-[40ch] text-[15px] text-white/60">{description}</p>}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  text,
  tone = "light",
  className,
}: {
  icon: IconType;
  title: string;
  text: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-[14px] p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1",
        tone === "dark"
          ? "bg-graphite hairline-dark hover:shadow-[inset_0_0_0_1px_oklch(0.775_0.215_133/0.4)]"
          : "border border-ink/[0.07] bg-white shadow-[0_1px_2px_oklch(0.155_0.006_165/0.04)] hover:border-green-deep/40 hover:shadow-[0_18px_40px_-24px_oklch(0.155_0.006_165/0.35)]",
        className,
      )}
    >
      <IconTile icon={icon} size="md" tone={tone === "dark" ? "dark" : "light"} />
      <h3 className={cn("mt-5 text-lg font-semibold", tone === "dark" ? "text-white" : "text-ink")}>{title}</h3>
      <p className={cn("mt-2 text-[15px] leading-relaxed", tone === "dark" ? "text-white/60" : "text-mute")}>{text}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
  className,
  tone = "light",
}: {
  icon: IconType;
  title: string;
  text: string;
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-[14px] px-6 py-16 text-center",
        tone === "dark" ? "bg-graphite hairline-dark" : "border border-dashed border-ink/15 bg-white",
        className,
      )}
    >
      <div className="relative mb-6">
        <span className="absolute inset-0 rounded-2xl bg-green/30 blur-xl" aria-hidden />
        <span className="relative flex size-16 items-center justify-center rounded-2xl bg-ink text-green">
          <Icon className="size-7" strokeWidth={1.5} aria-hidden />
        </span>
      </div>
      <h3 className={cn("type-h3", tone === "dark" ? "text-white" : "text-ink")}>{title}</h3>
      <p className={cn("mt-3 max-w-md text-[15px]", tone === "dark" ? "text-white/60" : "text-mute")}>{text}</p>
      {action && <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
