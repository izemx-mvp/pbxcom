import { forwardRef, useRef, type ButtonHTMLAttributes, type ReactNode, type MouseEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,box-shadow,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "rounded-[10px] bg-green text-ink hover:bg-green-bright hover:shadow-[0_0_0_1px_oklch(0.83_0.2_133/0.5),0_8px_32px_-6px_oklch(0.775_0.215_133/0.55)] active:bg-green-deep active:text-white",
        secondary:
          "rounded-[10px] border border-white/15 bg-white/[0.03] text-white hover:border-green/70 hover:bg-white/[0.06]",
        "secondary-light":
          "rounded-[10px] border border-ink/15 bg-white text-ink hover:border-green-deep hover:shadow-[0_6px_24px_-10px_oklch(0.155_0.006_165/0.35)]",
        dark: "rounded-[10px] bg-ink text-white hover:bg-graphite hover:shadow-[0_8px_30px_-8px_oklch(0.155_0.006_165/0.6)]",
        ghost: "rounded-md px-0 text-current link-underline",
        icon: "rounded-[10px] border border-white/10 bg-white/[0.04] text-white hover:border-green/60 hover:text-green",
        "icon-light": "rounded-[10px] border border-ink/10 bg-white text-ink hover:border-green-deep hover:text-green-deep",
        whatsapp: "rounded-[10px] bg-[#25D366] text-ink hover:brightness-105 hover:shadow-[0_8px_30px_-8px_rgba(37,211,102,0.6)]",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-5 text-[15px]",
        lg: "h-14 px-7 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    compoundVariants: [{ variant: "ghost", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/** Label + sliding arrow. Use inside any element styled with buttonVariants. */
export function ButtonContent({ children, arrow = false, icon }: { children: ReactNode; arrow?: boolean | undefined; icon?: ReactNode }) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-1"
          strokeWidth={2}
        />
      )}
    </>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & { arrow?: boolean; icon?: ReactNode; loading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, arrow, icon, loading, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      <ButtonContent arrow={!loading && arrow} icon={loading ? undefined : icon}>
        {children}
      </ButtonContent>
    </button>
  );
});

/** Magnetic hover wrapper for hero CTAs (desktop pointer only, disabled with reduced motion). */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("inline-flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", className)}
    >
      {children}
    </span>
  );
}
