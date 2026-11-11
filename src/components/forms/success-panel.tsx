import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildMailtoUrl, buildWhatsAppUrl } from "@/lib/whatsapp";

export function AnimatedCheck({ className, size = 72 }: { className?: string; size?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <motion.span
        className="absolute inset-0 rounded-full bg-green/25"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.35, 1.15], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-hidden
      />
      <motion.svg
        viewBox="0 0 72 72"
        className="relative h-full w-full"
        initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        aria-hidden
      >
        <circle cx="36" cy="36" r="34" fill="var(--green)" />
        <motion.path
          d="M22 37 L32 47 L51 27"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>
    </div>
  );
}

/** Designed success screen shown after any form → WhatsApp hand-off. */
export function SuccessPanel({
  title,
  text,
  message,
  subject,
  tone = "light",
  children,
}: {
  title: string;
  text: ReactNode;
  message: string;
  subject: string;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-6 text-center"
      role="status"
      aria-live="polite"
    >
      <AnimatedCheck />
      <h3 className={cn("mt-6 font-display text-2xl font-semibold", tone === "dark" ? "text-white" : "text-ink")}>{title}</h3>
      <div className={cn("mt-3 max-w-md text-[15px]", tone === "dark" ? "text-white/65" : "text-mute")}>{text}</div>
      <div className="mt-7 flex w-full max-w-sm flex-col gap-2">
        <a
          href={buildWhatsAppUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#25D366] font-medium text-ink hover:brightness-105"
        >
          <MessageCircle className="size-4" aria-hidden />
          Ouvrir WhatsApp à nouveau
        </a>
        <a
          href={buildMailtoUrl(subject, message.replace(/\*/g, ""))}
          className={cn(
            "flex h-12 items-center justify-center gap-2 rounded-[10px] border text-sm font-medium",
            tone === "dark" ? "border-white/15 text-white hover:border-green" : "border-ink/12 text-ink hover:border-green-deep",
          )}
        >
          <Mail className="size-4" aria-hidden />
          Pas de WhatsApp ? Envoyer par e-mail
        </a>
      </div>
      {children}
    </motion.div>
  );
}
