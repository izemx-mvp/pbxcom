import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { images } from "@/config/images";
import { useUI } from "@/lib/ui-state";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { readStorage, writeStorage } from "@/lib/storage";
import { WhatsAppIcon } from "@/components/site/icons";

const TEASER_KEY = "pbxcom-chat-teaser-seen";

export function FloatingStack() {
  const { chatOpen, openChat, stickyBarVisible } = useUI();
  const [teaser, setTeaser] = useState(false);

  useEffect(() => {
    if (readStorage<boolean>(TEASER_KEY, false)) return;
    const t = window.setTimeout(() => setTeaser(true), 8000);
    return () => window.clearTimeout(t);
  }, []);

  const dismissTeaser = () => {
    setTeaser(false);
    writeStorage(TEASER_KEY, true);
  };

  useEffect(() => {
    if (chatOpen && teaser) dismissTeaser();
  }, [chatOpen, teaser]);

  const hidden = chatOpen || stickyBarVisible;

  return (
    <div
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 transition-[opacity,transform] duration-300 md:bottom-6 md:right-6",
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100",
      )}
      aria-hidden={hidden || undefined}
    >
      <AnimatePresence>
        {teaser && !hidden && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative mr-1 max-w-[260px] rounded-2xl rounded-br-md bg-white p-4 pr-9 text-sm text-ink shadow-[0_20px_50px_-20px_oklch(0.155_0.006_165/0.5)] ring-1 ring-ink/5"
          >
            <button type="button" onClick={() => { dismissTeaser(); openChat(); }} className="cursor-pointer text-left">
              <span className="label-mono mb-1 block text-[10px] text-green-deep">Assistant PBXcom</span>
              Besoin d'un devis ou d'un produit ? Je vous guide.
            </button>
            <button
              type="button"
              onClick={dismissTeaser}
              className="absolute right-1.5 top-1.5 flex size-8 cursor-pointer items-center justify-center rounded-full text-mute hover:bg-paper hover:text-ink"
              aria-label="Masquer le message"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={buildWhatsAppUrl(defaultWhatsAppMessage)}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hidden ? -1 : 0}
        className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-ink shadow-[0_12px_32px_-10px_rgba(37,211,102,0.7)] transition-transform hover:scale-105"
        aria-label="Discuter sur WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping-ring" aria-hidden />
        <WhatsAppIcon className="relative size-7" />
      </a>
      <button
        type="button"
        onClick={() => openChat()}
        tabIndex={hidden ? -1 : 0}
        className="group relative flex size-14 cursor-pointer items-center justify-center rounded-full bg-ink shadow-[0_12px_32px_-10px_oklch(0.155_0.006_165/0.8)] ring-1 ring-green/40 transition-transform hover:scale-105"
        aria-label="Ouvrir l'Assistant PBXcom"
      >
        <img src={images.chatbot.avatar.src} alt="" width={40} height={40} className="size-9" />
        <span className="absolute right-0.5 top-0.5 size-3 rounded-full border-2 border-ink bg-green" aria-hidden />
      </button>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-green" />;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { stickyBarVisible, chatOpen } = useUI();
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const show = visible && !stickyBarVisible && !chatOpen;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={cn(
        "fixed bottom-6 left-4 z-40 hidden size-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-ink/90 text-white shadow-lg transition-[opacity,transform] duration-300 hover:text-green md:left-6 md:flex",
        show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-label="Revenir en haut de la page"
      tabIndex={show ? 0 : -1}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
