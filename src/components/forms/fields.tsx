import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

const fieldBase = (tone: Tone, invalid: boolean) =>
  cn(
    "peer block w-full rounded-[10px] border px-4 pb-2 pt-6 text-[15px] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-transparent",
    tone === "dark"
      ? "border-white/10 bg-white/[0.04] text-white focus:border-green focus:bg-white/[0.06]"
      : "border-ink/12 bg-white text-ink focus:border-green-deep focus:shadow-[0_0_0_3px_oklch(0.775_0.215_133/0.18)]",
    invalid && "border-[#E5484D] focus:border-[#E5484D] focus:shadow-[0_0_0_3px_rgba(229,72,77,0.15)]",
  );

const labelBase = (tone: Tone) =>
  cn(
    "pointer-events-none absolute left-4 top-4 origin-left text-[15px] transition-all duration-200",
    "peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-medium peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium",
    tone === "dark" ? "text-white/45 peer-focus:text-green" : "text-mute peer-focus:text-green-deep",
  );

function FieldMessage({ id, error, hint, tone }: { id: string; error?: string | undefined; hint?: string | undefined; tone: Tone }) {
  if (error)
    return (
      <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#E5484D]" role="alert">
        <AlertCircle className="size-3.5 shrink-0" aria-hidden />
        {error}
      </p>
    );
  if (hint) return <p id={id} className={cn("mt-1.5 text-[12px]", tone === "dark" ? "text-white/40" : "text-mute")}>{hint}</p>;
  return null;
}

type BaseProps = { label: string; error?: string | undefined; hint?: string | undefined; tone?: Tone; optional?: boolean; className?: string };

export const TextField = forwardRef<HTMLInputElement, BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "className">>(function TextField(
  { label, error, hint, tone = "light", optional, className, id, ...props },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  const msgId = `${fieldId}-msg`;
  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          placeholder=" "
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? msgId : undefined}
          className={cn(fieldBase(tone, Boolean(error)), "h-14")}
          {...props}
        />
        <label htmlFor={fieldId} className={labelBase(tone)}>
          {label}
          {optional && <span className="ml-1 opacity-60">(optionnel)</span>}
        </label>
      </div>
      <FieldMessage id={msgId} error={error} hint={hint} tone={tone} />
    </div>
  );
});

export const TextAreaField = forwardRef<HTMLTextAreaElement, BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">>(function TextAreaField(
  { label, error, hint, tone = "light", optional, className, id, rows = 4, ...props },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  const msgId = `${fieldId}-msg`;
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          placeholder=" "
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? msgId : undefined}
          className={cn(fieldBase(tone, Boolean(error)), "resize-y pt-7")}
          {...props}
        />
        <label htmlFor={fieldId} className={labelBase(tone)}>
          {label}
          {optional && <span className="ml-1 opacity-60">(optionnel)</span>}
        </label>
      </div>
      <FieldMessage id={msgId} error={error} hint={hint} tone={tone} />
    </div>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  BaseProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & { options: Array<{ value: string; label: string }>; placeholder?: string }
>(function SelectField({ label, error, hint, tone = "light", optional, className, id, options, placeholder = "Choisir…", ...props }, ref) {
  const auto = useId();
  const fieldId = id ?? auto;
  const msgId = `${fieldId}-msg`;
  return (
    <div className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? msgId : undefined}
          className={cn(fieldBase(tone, Boolean(error)), "h-14 cursor-pointer appearance-none pr-10", tone === "dark" && "[&>option]:bg-graphite")}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label htmlFor={fieldId} className={cn(labelBase(tone), "top-2 text-[11px] font-medium")}>
          {label}
          {optional && <span className="ml-1 opacity-60">(optionnel)</span>}
        </label>
        <ChevronDown className={cn("pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2", tone === "dark" ? "text-white/50" : "text-mute")} aria-hidden />
      </div>
      <FieldMessage id={msgId} error={error} hint={hint} tone={tone} />
    </div>
  );
});

export function FormCard({ children, className, accent = true }: { children: ReactNode; className?: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] border border-ink/[0.07] bg-white p-6 shadow-[0_30px_70px_-40px_oklch(0.155_0.006_165/0.45)] md:p-8",
        accent && "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-green",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const phoneRegex = /^(?:(?:\+|00)212|0)\s*[5-7](?:[\s.-]*\d){8}$/;
export const phoneError = "Indiquez un numéro marocain valide (ex. 06 12 34 56 78).";
