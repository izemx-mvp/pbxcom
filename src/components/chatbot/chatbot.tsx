import { Fragment, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, FileText, RotateCcw, Send, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { images } from "@/config/images";
import { useUI } from "@/lib/ui-state";
import { useCart } from "@/lib/cart";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { formatTime } from "@/lib/format";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";
import {
  buildQuoteWhatsAppMessage,
  emptyFlow,
  handleUserInput,
  quoteFormHref,
  startQuoteFlow,
  type ChatMessage,
  type FlowState,
  type QuoteSummary,
} from "@/lib/chatbot";
import { welcomeChips, welcomeMessage, type BotReply, type ChatChip } from "@/data/chatbot";
import { getProduct } from "@/data/products";
import { splitHref } from "@/components/site/app-link";
import { AppLink } from "@/components/site/app-link";
import { ProductImage } from "@/components/site/product-card";
import { PriceTag } from "@/components/site/primitives";
import { WhatsAppIcon } from "@/components/site/icons";

const STORAGE_KEY = "pbxcom-chat-v1";
type Persisted = { messages: ChatMessage[]; flow: FlowState };

let idCounter = 0;
const uid = () => `${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

const welcome = (): ChatMessage => ({ id: uid(), from: "bot", text: welcomeMessage, time: Date.now(), chips: welcomeChips });

/** Minimal formatting: **bold** and line breaks */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i, arr) => (
        <Fragment key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-semibold text-white">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            ),
          )}
          {i < arr.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

function ChatProductCard({ slug, onNavigate }: { slug: string; onNavigate: () => void }) {
  const product = getProduct(slug);
  const addToCart = useAddToCart();
  const btnRef = useRef<HTMLButtonElement>(null);
  if (!product) return null;
  return (
    <div className="flex w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white text-ink">
      <div className="relative">
        <ProductImage product={product} ratio="16/10" sizes="220px" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <span className="label-mono text-[10px] text-green-deep">{product.brand}</span>
        <p className="line-clamp-2 text-[13px] font-medium leading-snug">{product.name}</p>
        <PriceTag price={product.price} size="sm" />
        <div className="mt-auto grid grid-cols-2 gap-1.5 pt-1">
          <AppLink
            href={`/produit/${product.slug}`}
            onClick={onNavigate}
            className="flex h-9 items-center justify-center rounded-lg border border-ink/10 text-[12px] font-medium hover:border-green-deep"
          >
            Voir
          </AppLink>
          {product.price !== null ? (
            <button
              ref={btnRef}
              type="button"
              onClick={() => addToCart(product.slug, 1, btnRef.current)}
              className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-lg bg-green text-[12px] font-medium text-ink hover:bg-green-bright"
              aria-label={`Ajouter ${product.name} au panier`}
            >
              <ShoppingBag className="size-3.5" aria-hidden /> Ajouter
            </button>
          ) : (
            <AppLink
              href={`/devis?service=${product.service}`}
              onClick={onNavigate}
              className="flex h-9 items-center justify-center rounded-lg bg-ink text-[12px] font-medium text-white"
            >
              Devis
            </AppLink>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ summary, onNavigate }: { summary: QuoteSummary; onNavigate: () => void }) {
  const rows: Array<[string, string | undefined]> = [
    ["Secteur", summary.secteurName],
    ["Besoin", summary.besoinName],
    ["Projet", summary.description],
    ["Nom", summary.nom],
    ["Téléphone", summary.telephone],
  ];
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-green/30 bg-ink">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="flex size-6 items-center justify-center rounded-full bg-green text-ink">
          <Check className="size-3.5" aria-hidden />
        </span>
        <span className="text-sm font-semibold text-white">Récapitulatif de votre demande</span>
      </div>
      <dl className="flex flex-col gap-2 px-4 py-3 text-[13px]">
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="grid grid-cols-[84px_1fr] gap-2">
              <dt className="label-mono text-[10px] leading-5 text-white/45">{k}</dt>
              <dd className="text-white/90">{v}</dd>
            </div>
          ))}
      </dl>
      <div className="flex flex-col gap-2 p-3 pt-1">
        <a
          href={buildWhatsAppUrl(buildQuoteWhatsAppMessage(summary))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#25D366] text-sm font-semibold text-ink hover:brightness-105"
        >
          <WhatsAppIcon className="size-4" /> Envoyer sur WhatsApp
        </a>
        <AppLink
          href={quoteFormHref(summary)}
          onClick={onNavigate}
          className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-white/15 text-sm font-medium text-white hover:border-green"
        >
          <FileText className="size-4" aria-hidden /> Continuer sur le formulaire
        </AppLink>
      </div>
    </div>
  );
}

export function Chatbot() {
  const { chatOpen, setChatOpen, chatPrompt, clearChatPrompt } = useUI();
  const { count } = useCart();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [flow, setFlow] = useState<FlowState>(emptyFlow);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Restore history (sessionStorage)
  useEffect(() => {
    const saved = readStorage<Persisted | null>(STORAGE_KEY, null, "session");
    if (saved && Array.isArray(saved.messages) && saved.messages.length > 0) {
      setMessages(saved.messages);
      setFlow(saved.flow ?? emptyFlow);
    } else {
      setMessages([welcome()]);
    }
    setHydrated(true);
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage<Persisted>(STORAGE_KEY, { messages: messages.slice(-60), flow }, "session");
  }, [messages, flow, hydrated]);

  // Auto-scroll
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, typing, chatOpen, reduce]);

  const close = useCallback(() => setChatOpen(false), [setChatOpen]);

  // Focus management + trap + Escape
  useEffect(() => {
    if (!chatOpen) {
      lastFocus.current?.focus?.();
      return;
    }
    lastFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [chatOpen, close]);

  const pushBot = useCallback(
    (reply: BotReply & { summary?: QuoteSummary }) => {
      setTyping(true);
      const delay = reduce ? 250 : 500 + Math.random() * 400;
      const t = window.setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            from: "bot",
            text: reply.text,
            time: Date.now(),
            ...(reply.chips?.length ? { chips: reply.chips } : {}),
            ...(reply.products?.length ? { products: reply.products } : {}),
            ...(reply.links?.length ? { links: reply.links } : {}),
            ...(reply.summary ? { summary: reply.summary } : {}),
          },
        ]);
      }, delay);
      timers.current.push(t);
    },
    [reduce],
  );

  const pushUser = (text: string) => setMessages((m) => [...m, { id: uid(), from: "user", text, time: Date.now() }]);

  const send = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || typing) return;
      pushUser(value);
      const result = handleUserInput(value, flow, { cartCount: count });
      setFlow(result.flow);
      pushBot(result.reply);
    },
    [flow, count, pushBot, typing],
  );

  const goTo = (href: string) => {
    const { path, hash, search } = splitHref(href);
    void navigate({ to: path as never, ...(hash ? { hash } : {}), ...(search ? { search: search as never } : {}) });
    if (window.matchMedia("(max-width: 767px)").matches) close();
  };

  const onChip = (chip: ChatChip) => {
    const [kind, ...rest] = chip.action.split(":");
    const arg = rest.join(":");
    if (kind === "text") send(arg);
    else if (kind === "flow") {
      if (typing) return;
      pushUser(chip.label.replace(/^\S+\s/, ""));
      const r = startQuoteFlow(arg.startsWith("devis:") ? arg.slice(6) : rest[1]);
      setFlow(r.flow);
      pushBot(r.reply);
    } else if (kind === "link") goTo(arg);
    else if (kind === "wa") window.open(buildWhatsAppUrl(defaultWhatsAppMessage), "_blank", "noopener,noreferrer");
  };

  // Prompt sent from a CTA elsewhere on the site
  useEffect(() => {
    if (chatOpen && chatPrompt && hydrated) {
      clearChatPrompt();
      if (chatPrompt === "flow:devis") onChip({ label: "📝 Demander un devis", action: "flow:devis" });
      else send(chatPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOpen, chatPrompt, hydrated]);

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setTyping(false);
    removeStorage(STORAGE_KEY, "session");
    setFlow(emptyFlow);
    setMessages([welcome()]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
    setInput("");
  };

  const lastBotId = [...messages].reverse().find((m) => m.from === "bot")?.id;

  return (
    <AnimatePresence>
      {chatOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Assistant PBXcom"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.9, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: reduce ? 1 : 0.92, y: reduce ? 0 : 16 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{ transformOrigin: "bottom right" }}
          className="fixed inset-0 z-[75] flex flex-col overflow-hidden bg-ink text-white shadow-[0_40px_100px_-30px_oklch(0_0_0/0.8)] md:inset-auto md:bottom-6 md:right-6 md:h-[min(640px,calc(100svh-48px))] md:w-[400px] md:rounded-[20px] md:ring-1 md:ring-white/10"
        >
          {/* Glass header */}
          <div className="glass relative z-10 flex items-center gap-3 border-b border-white/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="relative">
              <img src={images.chatbot.avatar.src} alt="" width={44} height={44} className="size-11 rounded-full bg-graphite p-1.5 ring-1 ring-green/40" />
              <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-ink bg-green" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-semibold">Assistant PBXcom</p>
              <p className="flex items-center gap-1.5 text-[12px] text-white/60">
                <span className="size-1.5 rounded-full bg-green animate-pulse-dot" aria-hidden /> En ligne · Réponse immédiate
              </p>
            </div>
            <button type="button" onClick={reset} className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.06] hover:text-white" aria-label="Recommencer la conversation">
              <RotateCcw className="size-4" />
            </button>
            <button type="button" onClick={close} className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.06] hover:text-white" aria-label="Fermer l'assistant">
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite" aria-relevant="additions">
            <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50" aria-hidden />
            <ul className="relative flex flex-col gap-4">
              {messages.map((m) => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn("flex flex-col", m.from === "user" ? "items-end" : "items-start")}
                >
                  <div className={cn("flex max-w-full gap-2", m.from === "user" && "flex-row-reverse")}>
                    {m.from === "bot" && (
                      <img src={images.chatbot.avatar.src} alt="" width={28} height={28} className="mt-0.5 size-7 shrink-0 rounded-full bg-graphite p-1" />
                    )}
                    <div className="flex min-w-0 flex-col gap-1">
                      <div
                        className={cn(
                          "max-w-[290px] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                          m.from === "bot" ? "rounded-tl-md bg-graphite text-white/85 hairline-dark" : "rounded-tr-md bg-green text-ink",
                        )}
                      >
                        <RichText text={m.text} />
                      </div>
                      {m.links && (
                        <div className="flex flex-col gap-1">
                          {m.links.map((l) => (
                            <button
                              key={l.href}
                              type="button"
                              onClick={() => goTo(l.href)}
                              className="inline-flex cursor-pointer items-center gap-1.5 self-start text-[13px] font-medium text-green hover:text-green-bright"
                            >
                              {l.label} <ArrowRight className="size-3.5" aria-hidden />
                            </button>
                          ))}
                        </div>
                      )}
                      {m.summary && <SummaryCard summary={m.summary} onNavigate={close} />}
                      <span className={cn("text-[10px] text-white/35", m.from === "user" && "text-right")}>{formatTime(new Date(m.time))}</span>
                    </div>
                  </div>
                  {m.products && (
                    <div className="no-scrollbar -mx-4 mt-2 flex w-[calc(100%+2rem)] snap-x gap-3 overflow-x-auto px-4 pb-1 pl-[52px]">
                      {m.products.map((slug) => (
                        <ChatProductCard key={slug} slug={slug} onNavigate={() => window.matchMedia("(max-width: 767px)").matches && close()} />
                      ))}
                    </div>
                  )}
                  {m.chips && m.id === lastBotId && !typing && (
                    <div className="mt-3 flex flex-wrap gap-2 pl-9">
                      {m.chips.map((c) => (
                        <button
                          key={c.label + c.action}
                          type="button"
                          onClick={() => onChip(c)}
                          className="min-h-9 cursor-pointer rounded-full border border-green/35 bg-green/[0.06] px-3 py-1.5 text-[13px] text-white/90 transition-colors hover:border-green hover:bg-green hover:text-ink"
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.li>
              ))}
              {typing && (
                <li className="flex items-center gap-2" aria-label="L'assistant écrit">
                  <img src={images.chatbot.avatar.src} alt="" width={28} height={28} className="size-7 rounded-full bg-graphite p-1" />
                  <span className="flex gap-1 rounded-2xl rounded-tl-md bg-graphite px-4 py-3.5 hairline-dark">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-1.5 rounded-full bg-green" style={{ animation: `typing-dot 1s ${i * 0.15}s infinite` }} />
                    ))}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Input */}
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 bg-graphite p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <label htmlFor="chat-input" className="sr-only">
              Votre message
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={flow.step === "telephone" ? "06 12 34 56 78" : "Écrivez votre message…"}
              autoComplete={flow.step === "nom" ? "name" : flow.step === "telephone" ? "tel" : "off"}
              inputMode={flow.step === "telephone" ? "tel" : "text"}
              maxLength={500}
              className="h-12 min-w-0 flex-1 rounded-[12px] border border-white/10 bg-ink px-4 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-green"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-green text-ink transition-colors hover:bg-green-bright disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Envoyer"
            >
              <Send className="size-5" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

