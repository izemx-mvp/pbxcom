import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart";
import { UIProvider, useUI } from "@/lib/ui-state";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { BackToTop, FloatingStack, ScrollProgress } from "./floating";
import { QuickView } from "./quick-view";
import { SearchDialog } from "./search-dialog";
import { Chatbot } from "@/components/chatbot/chatbot";

function GlobalShortcuts() {
  const { setSearchOpen } = useUI();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);
  return null;
}

/** Close overlays and reset the mobile sticky bar flag on navigation. */
function RouteEffects() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { setCartOpen, setSearchOpen, setQuickView, setStickyBarVisible } = useUI();
  useEffect(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setQuickView(null);
    setStickyBarVisible(false);
  }, [pathname, setCartOpen, setSearchOpen, setQuickView, setStickyBarVisible]);
  return null;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <MotionConfig reducedMotion="user">
      <UIProvider>
        <CartProvider>
          <a
            href="#contenu"
            className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-[10px] bg-green px-4 py-3 font-medium text-ink transition-transform focus:translate-y-0"
          >
            Aller au contenu
          </a>
          <ScrollProgress />
          <Header />
          <main id="contenu" key={pathname} className="page-enter min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <FloatingStack />
          <BackToTop />
          <CartDrawer />
          <QuickView />
          <SearchDialog />
          <Chatbot />
          <GlobalShortcuts />
          <RouteEffects />
          <Toaster
            position="bottom-center"
            offset={24}
            toastOptions={{
              classNames: {
                toast: "!rounded-[14px] !border !border-white/10 !bg-ink !text-white !shadow-2xl !font-sans",
                description: "!text-white/60",
                actionButton: "!bg-green !text-ink !font-medium !rounded-lg",
                success: "[&_[data-icon]]:!text-green",
              },
            }}
          />
        </CartProvider>
      </UIProvider>
    </MotionConfig>
  );
}
