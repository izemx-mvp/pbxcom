import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const staggerParent = (stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

export function Stagger({
  children,
  className,
  stagger = 0.07,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={staggerParent(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
    >
      {children}
    </Comp>
  );
}

/** Word-by-word reveal for hero headlines. `highlight` words are rendered green. */
export function WordReveal({ text, highlight, className, delay = 0.1 }: { text: string; highlight?: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const highlightWords = new Set((highlight ?? "").split(" ").filter(Boolean));
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={cn("inline-block", highlightWords.has(word) && "text-green")}
            initial={{ y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.06 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

/** Count-up for real numbers only. */
export function CountUp({ to, duration = 1.6, prefix = "", suffix = "", className }: { to: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
