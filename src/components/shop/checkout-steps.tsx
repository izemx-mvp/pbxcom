import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Panier", "Coordonnées", "Confirmation"];

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Étapes de la commande">
      {steps.map((s, i) => {
        const done = i < current;
        const on = i === current;
        return (
          <li key={s} className="flex items-center gap-2" aria-current={on ? "step" : undefined}>
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full font-mono text-[12px]",
                done && "bg-green text-ink",
                on && "bg-white text-ink",
                !done && !on && "border border-white/20 text-white/50",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
            </span>
            <span className={cn("hidden sm:inline", on ? "text-white" : "text-white/55")}>{s}</span>
            {i < steps.length - 1 && <span className={cn("h-px w-6 sm:w-10", done ? "bg-green" : "bg-white/20")} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
