import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type UIContextValue = {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  quickView: string | null;
  setQuickView: (slug: string | null) => void;
  /** true while a page shows its own mobile sticky bar (hides the floating buttons) */
  stickyBarVisible: boolean;
  setStickyBarVisible: (visible: boolean) => void;
  /** a message the chatbot should send on open (e.g. from a CTA) */
  chatPrompt: string | null;
  openChat: (prompt?: string) => void;
  clearChatPrompt: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);

  const openChat = useCallback((prompt?: string) => {
    setChatPrompt(prompt ?? null);
    setChatOpen(true);
  }, []);

  const clearChatPrompt = useCallback(() => setChatPrompt(null), []);

  const value = useMemo(
    () => ({
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      chatOpen,
      setChatOpen,
      quickView,
      setQuickView,
      stickyBarVisible,
      setStickyBarVisible,
      chatPrompt,
      openChat,
      clearChatPrompt,
    }),
    [cartOpen, searchOpen, chatOpen, quickView, stickyBarVisible, chatPrompt, openChat, clearChatPrompt],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
