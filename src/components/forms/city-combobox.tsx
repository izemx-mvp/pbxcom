import { forwardRef, useId, useMemo, useState } from "react";
import { AlertCircle, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { moroccanCities } from "@/data/cities";
import { normalizeText } from "@/lib/format";

/** Accessible combobox (ARIA 1.2 pattern) over Moroccan cities; free text is allowed. */
export const CityCombobox = forwardRef<
  HTMLInputElement,
  { value: string; onChange: (v: string) => void; onBlur?: () => void; error?: string | undefined; label?: string; name?: string }
>(function CityCombobox({ value, onChange, onBlur, error, label = "Ville", name }, ref) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const options = useMemo(() => {
    const q = normalizeText(value);
    const list = q ? moroccanCities.filter((c) => normalizeText(c).includes(q)) : moroccanCities;
    return list.slice(0, 8);
  }, [value]);

  const select = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <div>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={name}
          role="combobox"
          aria-expanded={open && options.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && options[active] ? `${id}-opt-${active}` : undefined}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          autoComplete="address-level2"
          placeholder=" "
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
            onBlur?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(options.length - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter" && open && options[active]) {
              e.preventDefault();
              select(options[active]!);
            } else if (e.key === "Escape") setOpen(false);
          }}
          className={cn(
            "peer block h-14 w-full rounded-[10px] border bg-white pb-2 pl-11 pr-4 pt-6 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-transparent focus:border-green-deep focus:shadow-[0_0_0_3px_oklch(0.775_0.215_133/0.18)]",
            error ? "border-[#E5484D]" : "border-ink/12",
          )}
        />
        <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mute" aria-hidden />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-11 top-4 text-[15px] text-mute transition-all peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-green-deep peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium"
        >
          {label}
        </label>
        {open && options.length > 0 && (
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label="Villes du Maroc"
            className="absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-y-auto rounded-[12px] border border-ink/10 bg-white p-1.5 shadow-[0_20px_50px_-20px_oklch(0.155_0.006_165/0.4)]"
          >
            {options.map((c, i) => (
              <li
                key={c}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={c === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(c);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn("flex min-h-10 cursor-pointer items-center justify-between rounded-lg px-3 text-[15px]", i === active ? "bg-paper text-ink" : "text-ink/80")}
              >
                {c}
                {c === value && <Check className="size-4 text-green-deep" aria-hidden />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#E5484D]" role="alert">
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
});
