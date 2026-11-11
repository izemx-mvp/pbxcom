import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedCheck } from "@/components/forms/success-panel";
import { EASE } from "@/components/site/motion";

/** Simple success state shown after a form is submitted (no WhatsApp / e-mail hand-off). */
export function FormSuccess({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-6 text-center" role="status" aria-live="polite">
      <AnimatedCheck size={80} />
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
        className="type-h3 mt-6 text-ink"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
        className="mt-3 max-w-md text-[15px] leading-relaxed text-mute"
      >
        {text}
      </motion.p>
      {children}
    </div>
  );
}