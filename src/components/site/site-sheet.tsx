import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Accessible side / bottom sheet on Radix Dialog (focus trap, Esc, aria) with brand styling. */
export function SiteSheet({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  tone = "light",
  children,
  footer,
  className,
  headerExtra,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  side?: "right" | "bottom";
  tone?: "light" | "dark";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerExtra?: ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-ink/65 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-[81] flex flex-col shadow-[0_0_80px_-20px_oklch(0_0_0/0.5)] outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-200 data-[state=open]:duration-300",
            side === "right" &&
              "inset-y-0 right-0 h-full w-full max-w-[440px] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            side === "bottom" &&
              "inset-x-0 bottom-0 max-h-[88svh] rounded-t-[20px] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            tone === "dark" ? "bg-ink text-white" : "bg-paper text-ink",
            className,
          )}
        >
          {side === "bottom" && <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-current opacity-20" aria-hidden />}
          <div className={cn("flex items-start justify-between gap-4 px-6 pb-5 pt-5", tone === "dark" ? "border-b border-white/10" : "border-b border-ink/[0.08]")}>
            <div>
              <DialogPrimitive.Title className="font-display text-xl font-semibold">{title}</DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className={cn("mt-1 text-sm", tone === "dark" ? "text-white/60" : "text-mute")}>
                  {description}
                </DialogPrimitive.Description>
              ) : (
                <DialogPrimitive.Description className="sr-only">{typeof title === "string" ? title : "Panneau"}</DialogPrimitive.Description>
              )}
              {headerExtra}
            </div>
            <DialogPrimitive.Close
              className={cn(
                "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] transition-colors",
                tone === "dark" ? "bg-white/[0.06] hover:bg-white/10 hover:text-green" : "bg-white shadow-[inset_0_0_0_1px_oklch(0.155_0.006_165/0.1)] hover:text-green-deep",
              )}
              aria-label="Fermer"
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          {footer && (
            <div className={cn("px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5", tone === "dark" ? "border-t border-white/10" : "border-t border-ink/[0.08] bg-white")}>
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
