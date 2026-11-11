import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/data/faq";

export function SiteAccordion({ items, tone = "light", className }: { items: FaqItem[]; tone?: "light" | "dark"; className?: string }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={item.q}
          value={`item-${i}`}
          className={cn(
            "group overflow-hidden rounded-[14px] transition-[border-color,box-shadow] duration-200",
            tone === "dark"
              ? "bg-graphite hairline-dark data-[state=open]:shadow-[inset_0_0_0_1px_oklch(0.775_0.215_133/0.35)]"
              : "border border-ink/[0.08] bg-white data-[state=open]:border-green-deep/40 data-[state=open]:shadow-[0_18px_40px_-28px_oklch(0.155_0.006_165/0.4)]",
          )}
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className={cn(
                "flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left text-[17px] font-medium",
                tone === "dark" ? "text-white" : "text-ink",
              )}
            >
              {item.q}
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-300 group-data-[state=open]:rotate-45",
                  tone === "dark" ? "bg-white/[0.06] text-green group-data-[state=open]:bg-green group-data-[state=open]:text-ink" : "bg-paper text-green-deep group-data-[state=open]:bg-ink group-data-[state=open]:text-green",
                )}
                aria-hidden
              >
                <Plus className="size-4" />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className={cn("max-w-[70ch] px-6 pb-6 text-[15px] leading-relaxed", tone === "dark" ? "text-white/65" : "text-mute")}>
              {item.a}
            </p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
