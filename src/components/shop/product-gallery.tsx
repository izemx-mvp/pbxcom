import { useState, type MouseEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";

export type GalleryImage = { src: string; fallbackSrc?: string; alt: string; label?: string };

export function ProductGallery({ images, badge }: { images: GalleryImage[]; badge?: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const current = images[index] ?? images[0]!;
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse">
      <div className="relative flex-1">
        <div
          className="group relative cursor-zoom-in overflow-hidden rounded-[18px] border border-ink/[0.07] bg-white"
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
        >
          <SmartImage
            key={current.src}
            src={current.src}
            fallbackSrc={current.fallbackSrc}
            alt={current.alt}
            label={current.label}
            width={1200}
            height={1200}
            ratio="1/1"
            priority={index === 0}
            sizes="(min-width:1024px) 50vw, 100vw"
            imgClassName="transition-transform duration-200 ease-out"
            style={zoom ? ({ ["--zx" as string]: `${zoom.x}%`, ["--zy" as string]: `${zoom.y}%` } as React.CSSProperties) : undefined}
            className={cn(zoom && "[&_img]:scale-[1.8] [&_img]:[transform-origin:var(--zx)_var(--zy)]")}
          />
          {badge && <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">{badge}</div>}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(true);
            }}
            className="absolute bottom-4 right-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-colors hover:text-green-deep"
            aria-label="Afficher en plein écran"
          >
            <Expand className="size-4" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink opacity-100 shadow-md transition-opacity md:opacity-0 md:group-hover:opacity-100"
                aria-label="Image précédente"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink opacity-100 shadow-md transition-opacity md:opacity-0 md:group-hover:opacity-100"
                aria-label="Image suivante"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
      </div>
      {images.length > 1 && (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto md:w-20 md:flex-col" aria-label="Miniatures">
          {images.map((img, i) => (
            <li key={img.src + i} className="w-20 shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Afficher l'image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "block w-full cursor-pointer overflow-hidden rounded-xl border-2 transition-colors",
                  i === index ? "border-green" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <SmartImage src={img.src} fallbackSrc={img.fallbackSrc} alt="" width={200} height={200} ratio="1/1" sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <DialogPrimitive.Root open={lightbox} onOpenChange={setLightbox}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-ink/95 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-[91] flex items-center justify-center p-4 outline-none md:p-12"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
          >
            <DialogPrimitive.Title className="sr-only">{current.alt}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Image {index + 1} sur {images.length}
            </DialogPrimitive.Description>
            <div className="relative w-full max-w-4xl">
              <SmartImage src={current.src} fallbackSrc={current.fallbackSrc} alt={current.alt} label={current.label} width={1600} height={1600} ratio="1/1" className="rounded-[18px]" sizes="90vw" />
            </div>
            <DialogPrimitive.Close className="absolute right-4 top-4 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Fermer">
              <X className="size-5" />
            </DialogPrimitive.Close>
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute left-4 top-1/2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Image précédente">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => go(1)} className="absolute right-4 top-1/2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Image suivante">
                  <ChevronRight className="size-6" />
                </button>
                <p className="label-mono absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60">
                  {index + 1} / {images.length}
                </p>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
