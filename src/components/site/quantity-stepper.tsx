import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantité",
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const h = size === "sm" ? "h-10" : "h-12";
  const btn = cn(
    "flex aspect-square h-full cursor-pointer items-center justify-center text-ink transition-colors hover:bg-paper hover:text-green-deep disabled:cursor-not-allowed disabled:opacity-30",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center overflow-hidden rounded-[10px] border border-ink/12 bg-white", h, className)}
    >
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Diminuer la quantité">
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, Math.round(n))));
        }}
        className="h-full w-10 border-x border-ink/10 bg-transparent text-center font-mono text-sm tabular-nums text-ink outline-none [appearance:textfield] focus:bg-paper [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Augmenter la quantité">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
