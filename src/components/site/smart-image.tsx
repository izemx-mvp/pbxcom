import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type SmartImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS aspect-ratio for the box, e.g. "16/9". Defaults to the image's intrinsic ratio. */
  ratio?: string | undefined;
  /** Fill the parent instead of using an aspect box (parent must be positioned and sized). */
  fill?: boolean | undefined;
  priority?: boolean | undefined;
  className?: string | undefined;
  imgClassName?: string | undefined;
  label?: string | undefined;
  sizes?: string | undefined;
  style?: CSSProperties | undefined;
  objectPosition?: string | undefined;
  /** Used if `src` fails to load, before falling back to the designed placeholder. */
  fallbackSrc?: string | undefined;
};

/** Designed fallback: ink→graphite gradient, circuit SVG, mono label. */
export function ImagePlaceholder({ label, className }: { label?: string | undefined; className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--ink),var(--graphite)_60%,var(--steel))]",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="xMidYMid slice">
        <path d="M0 30 H60 L72 42 H120 L132 30 H200 M0 90 H40 L52 78 H110 L122 90 H200 M100 0 V20 L88 32 M140 120 V100 L152 88 V60" fill="none" stroke="var(--green)" strokeWidth="0.6" />
        <circle cx="72" cy="42" r="2" fill="var(--green)" />
        <circle cx="132" cy="30" r="2" fill="var(--green)" />
        <circle cx="52" cy="78" r="2" fill="var(--green)" />
        <circle cx="152" cy="88" r="2" fill="var(--green)" />
      </svg>
      <div className="relative flex flex-col items-center gap-2">
        <svg viewBox="0 0 48 48" className="size-10 text-green" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 26a18 18 0 0 1 36 0" />
          <path d="M24 8c-5 5-7 11-7 18M24 8c5 5 7 11 7 18M8 20h32M6 26h36" />
          <path d="M18 26v6l-4 4M24 26v10M30 26v6l4 4" />
          <circle cx="14" cy="37" r="1.6" />
          <circle cx="24" cy="38" r="1.6" />
          <circle cx="34" cy="37" r="1.6" />
        </svg>
        {label && <span className="label-mono max-w-[80%] truncate text-center text-[10px] text-white/50">{label}</span>}
      </div>
    </div>
  );
}

export function SmartImage({
  src,
  alt,
  width,
  height,
  ratio,
  fill,
  priority,
  className,
  imgClassName,
  label,
  sizes = "100vw",
  style,
  objectPosition,
  fallbackSrc,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setLoaded(false);
      setCurrentSrc(fallbackSrc);
    } else setFailed(true);
  };
  const imgRef = useRef<HTMLImageElement>(null);

  // Image may already be complete (SSR + cache) before hydration attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else handleError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSrc]);

  const prevSrc = useRef(src);
  useEffect(() => {
    if (prevSrc.current === src) return;
    prevSrc.current = src;
    setFailed(false);
    setLoaded(false);
    setCurrentSrc(src);
  }, [src]);

  return (
    <div
      className={cn("relative overflow-hidden bg-graphite", fill ? "absolute inset-0" : "w-full", className)}
      style={{ ...(fill ? {} : { aspectRatio: ratio ?? `${width}/${height}` }), ...style }}
    >
      {failed ? (
        <ImagePlaceholder label={label ?? alt} />
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          {...(priority ? { fetchPriority: "high" as const } : {})}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            loaded || priority ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          style={objectPosition ? { objectPosition } : undefined}
        />
      )}
    </div>
  );
}
