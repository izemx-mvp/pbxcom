import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, FileText, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { mainNav } from "@/config/nav";
import { universes } from "@/data/universes";
import { servicesByUniverse } from "@/data/services";
import { categories } from "@/data/categories";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { FacebookIcon, InstagramIcon, Logo, WhatsAppIcon } from "@/components/site/icons";
import { GridBackground } from "@/components/site/circuit";
import { EASE } from "@/components/site/motion";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("button")?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const subLinks = (id: string) =>
    id === "solutions"
      ? universes.map((u) => ({
          title: u.name,
          universe: u.id,
          items: servicesByUniverse(u.id).map((s) => ({ label: s.name, slug: s.slug })),
        }))
      : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex flex-col bg-ink text-white lg:hidden"
        >
          <GridBackground />
          <div className="relative flex h-16 items-center justify-between px-4">
            <Logo className="h-7" />
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 cursor-pointer items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] hover:text-green"
              aria-label="Fermer le menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Navigation mobile" className="relative flex-1 overflow-y-auto px-4 pb-6 pt-4">
            <ul className="flex flex-col">
              {mainNav.map((item, i) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.04 + i * 0.05 }}
                  className="border-b border-white/[0.07]"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="flex-1 py-4 font-display text-[28px] font-semibold tracking-tight text-white/90 transition-colors hover:text-green"
                      activeProps={{ className: "text-green" }}
                      activeOptions={{ exact: item.to === "/" }}
                    >
                      {item.label}
                    </Link>
                    {item.mega && (
                      <button
                        type="button"
                        onClick={() => setExpanded((e) => (e === item.mega ? null : item.mega))}
                        aria-expanded={expanded === item.mega}
                        aria-label={`Afficher le sous-menu ${item.label}`}
                        className="flex size-11 cursor-pointer items-center justify-center rounded-[10px] bg-white/[0.05]"
                      >
                        <ChevronDown className={cn("size-5 transition-transform", expanded === item.mega && "rotate-180 text-green")} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {item.mega && expanded === item.mega && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5">
                          {item.mega === "solutions"
                            ? subLinks("solutions")!.map((g) => (
                                <div key={g.title} className="mb-4">
                                  <Link
                                    to="/solutions/$universe"
                                    params={{ universe: g.universe }}
                                    onClick={onClose}
                                    className="label-mono mb-2 block text-green"
                                  >
                                    {g.title}
                                  </Link>
                                  <div className="grid grid-cols-2 gap-1">
                                    {g.items.map((s) => (
                                      <Link
                                        key={s.slug}
                                        to="/solutions/$universe"
                                        params={{ universe: g.universe }}
                                        hash={s.slug}
                                        onClick={onClose}
                                        className="rounded-lg px-2 py-2.5 text-[15px] text-white/70 hover:bg-white/[0.04] hover:text-white"
                                      >
                                        {s.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))
                            : (
                                <div className="grid grid-cols-2 gap-1">
                                  {categories.map((c) => (
                                    <Link
                                      key={c.slug}
                                      to="/boutique/$category"
                                      params={{ category: c.slug }}
                                      onClick={onClose}
                                      className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-[15px] text-white/70 hover:bg-white/[0.04] hover:text-white"
                                    >
                                      <c.icon className="size-4 text-green" strokeWidth={1.5} aria-hidden />
                                      {c.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-2 text-sm text-white/60">
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
              <span>{site.address.full}</span>
              <div className="mt-3 flex gap-3">
                <a href={site.socials.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-11 items-center justify-center rounded-[10px] bg-white/[0.05] hover:text-green">
                  <FacebookIcon className="size-5" />
                </a>
                <a href={site.socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-11 items-center justify-center rounded-[10px] bg-white/[0.05] hover:text-green">
                  <InstagramIcon className="size-5" />
                </a>
              </div>
            </div>
          </nav>

          <div className="relative grid grid-cols-3 gap-2 border-t border-white/10 bg-graphite p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <a href={site.phone.href} className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-white/[0.06] text-xs font-medium">
              <Phone className="size-4 text-green" aria-hidden />
              Appeler
            </a>
            <a
              href={buildWhatsAppUrl(defaultWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-white/[0.06] text-xs font-medium"
            >
              <WhatsAppIcon className="size-4 text-[#25D366]" />
              WhatsApp
            </a>
            <Link to="/devis" onClick={onClose} className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-green text-xs font-semibold text-ink">
              <FileText className="size-4" aria-hidden />
              Devis
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
