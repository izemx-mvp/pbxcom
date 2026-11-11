import Fuse from "fuse.js";
import {
  besoinOptions,
  fallbackReply,
  intents,
  productKeywords,
  quoteFlowCopy,
  type BotReply,
  type ChatChip,
  type ChatContext,
  type ChatLink,
} from "@/data/chatbot";
import { products, productsByCategory } from "@/data/products";
import { sectors } from "@/data/sectors";
import { normalizeText } from "./format";

export type QuoteSummary = {
  secteur?: string;
  secteurName?: string;
  besoin?: string;
  besoinName?: string;
  description?: string;
  nom?: string;
  telephone?: string;
};

export type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
  time: number;
  chips?: ChatChip[];
  products?: string[];
  links?: ChatLink[];
  summary?: QuoteSummary;
};

export type FlowStep = "secteur" | "besoin" | "description" | "nom" | "telephone";
export type FlowState = { step: FlowStep | null; data: QuoteSummary };

export const emptyFlow: FlowState = { step: null, data: {} };

type EngineResult = { reply: BotReply & { summary?: QuoteSummary }; flow: FlowState };

/* ───────────── Keyword scoring */
const pad = (s: string) => ` ${s} `;

function keywordScore(input: string, keywords: string[]): number {
  const padded = pad(input);
  let score = 0;
  for (const raw of keywords) {
    const k = normalizeText(raw);
    if (!k) continue;
    const exact = padded.includes(pad(k));
    const partial = !exact && k.length >= 5 && input.includes(k);
    // plural / singular tolerance
    const plural = !exact && !partial && (padded.includes(pad(`${k}s`)) || (k.endsWith("s") && padded.includes(pad(k.slice(0, -1)))));
    if (exact || partial || plural) score += k.split(" ").length * 2 + k.length / 10;
  }
  return score;
}

export function matchIntent(input: string) {
  const text = normalizeText(input);
  let best: { intent: (typeof intents)[number]; score: number } | null = null;
  for (const intent of intents) {
    const score = keywordScore(text, intent.keywords);
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  return best;
}

/* ───────────── Product search */
const productFuse = new Fuse(
  products.map((p) => ({ slug: p.slug, text: normalizeText([p.name, p.brand, p.category, ...p.tags, ...p.shortSpecs].join(" ")) })),
  { keys: ["text"], threshold: 0.42, ignoreLocation: true, minMatchCharLength: 3 },
);

const STOP = new Set(["je", "cherche", "recherche", "un", "une", "des", "le", "la", "les", "de", "du", "pour", "prix", "avez", "vous", "voudrais", "veux", "besoin", "d'un", "d'une", "quel", "quelle", "est", "il", "y", "a", "acheter", "svp", "merci"]);

export function findProducts(query: string, limit = 3): string[] {
  const q = normalizeText(query)
    .split(" ")
    .filter((w) => w.length > 1 && !STOP.has(w))
    .join(" ");
  if (q.length < 3) return [];
  return productFuse.search(q, { limit }).map((r) => r.item.slug);
}

/* ───────────── Quote flow */
const sectorChips: ChatChip[] = sectors.map((s) => ({ label: s.name, action: `text:${s.name}` }));
const besoinChips: ChatChip[] = besoinOptions.map((b) => ({ label: b.label, action: `text:${b.name}` }));
const cancelChip: ChatChip = { label: "Annuler", action: "text:annuler" };

export function startQuoteFlow(presetSector?: string): EngineResult {
  const sector = presetSector ? sectors.find((s) => s.slug === presetSector) : undefined;
  if (sector) {
    return {
      reply: { text: `Parfait, un projet pour le secteur **${sector.name}**. ${quoteFlowCopy.besoin}`, chips: [...besoinChips, cancelChip] },
      flow: { step: "besoin", data: { secteur: sector.slug, secteurName: sector.name } },
    };
  }
  return { reply: { text: quoteFlowCopy.secteur, chips: [...sectorChips, cancelChip] }, flow: { step: "secteur", data: {} } };
}

function matchSector(input: string) {
  const text = normalizeText(input);
  return (
    sectors.find((s) => normalizeText(s.name) === text) ??
    sectors.find((s) => normalizeText(s.name).includes(text) || text.includes(normalizeText(s.slug))) ??
    (() => {
      const m = matchIntent(input);
      return m?.intent.id.startsWith("sector:") ? sectors.find((s) => `sector:${s.slug}` === m.intent.id) : undefined;
    })()
  );
}

function matchBesoin(input: string) {
  const text = normalizeText(input);
  const direct = besoinOptions.find((b) => normalizeText(b.name) === text || text.includes(b.value));
  if (direct) return direct;
  const m = matchIntent(input);
  if (!m) return undefined;
  const id = m.intent.id;
  if (id.startsWith("universe:")) return besoinOptions.find((b) => `universe:${b.value}` === id);
  return undefined;
}

export const isValidPhone = (value: string) => {
  const digits = value.replace(/[^\d+]/g, "").replace(/^\+?212/, "0").replace(/^00212/, "0");
  return /^0?[5-7]\d{8}$/.test(digits) || /^\d{9,13}$/.test(digits);
};

function continueFlow(input: string, flow: FlowState): EngineResult {
  const text = input.trim();
  const data = { ...flow.data };
  switch (flow.step) {
    case "secteur": {
      const sector = matchSector(text);
      data.secteur = sector?.slug ?? "autre";
      data.secteurName = sector?.name ?? text;
      return { reply: { text: quoteFlowCopy.besoin, chips: [...besoinChips, cancelChip] }, flow: { step: "besoin", data } };
    }
    case "besoin": {
      const besoin = matchBesoin(text);
      data.besoin = besoin?.value ?? "autre";
      data.besoinName = besoin?.name ?? text;
      return { reply: { text: quoteFlowCopy.description, chips: [cancelChip] }, flow: { step: "description", data } };
    }
    case "description": {
      if (text.length < 3) return { reply: { text: quoteFlowCopy.description, chips: [cancelChip] }, flow };
      data.description = text;
      return { reply: { text: quoteFlowCopy.nom, chips: [cancelChip] }, flow: { step: "nom", data } };
    }
    case "nom": {
      if (text.length < 2) return { reply: { text: quoteFlowCopy.nom, chips: [cancelChip] }, flow };
      data.nom = text;
      return { reply: { text: quoteFlowCopy.telephone, chips: [cancelChip] }, flow: { step: "telephone", data } };
    }
    case "telephone": {
      if (!isValidPhone(text)) return { reply: { text: quoteFlowCopy.telephoneInvalid, chips: [cancelChip] }, flow };
      data.telephone = text;
      return { reply: { text: quoteFlowCopy.summary, summary: data }, flow: emptyFlow };
    }
    default:
      return { reply: fallbackReply, flow: emptyFlow };
  }
}

/* ───────────── Main entry */
export function handleUserInput(input: string, flow: FlowState, ctx: ChatContext): EngineResult {
  const text = normalizeText(input);

  if (flow.step) {
    if (["annuler", "stop", "quitter", "cancel"].includes(text)) {
      return { reply: { text: quoteFlowCopy.cancelled, chips: fallbackReply.chips!.slice(0, 6) }, flow: emptyFlow };
    }
    return continueFlow(input, flow);
  }

  const best = matchIntent(input);
  const productScore = keywordScore(text, productKeywords);

  if (best?.intent.id === "devis" && productScore <= best.score) return startQuoteFlow();

  // Product search wins when product words dominate
  if (productScore > 0 && (!best || productScore > best.score || best.intent.id === "find-product")) {
    if (best?.intent.id === "find-product" && productScore <= best.score) {
      return { reply: best.intent.reply(ctx), flow };
    }
    const found = findProducts(input);
    if (found.length > 0) {
      return {
        reply: {
          text: `Voici ${found.length > 1 ? "quelques produits" : "un produit"} qui pourrai${found.length > 1 ? "ent" : "t"} vous intéresser 👇`,
          products: found,
          chips: [{ label: "🔎 Voir toute la boutique", action: "link:/boutique" }, { label: "📝 Devis avec installation", action: "flow:devis" }],
        },
        flow,
      };
    }
  }

  if (best) {
    const reply = best.intent.reply(ctx);
    const productsFromCategory = reply.productQuery ? productsByCategory(reply.productQuery).slice(0, 3).map((p) => p.slug) : undefined;
    return { reply: { ...reply, ...(productsFromCategory?.length ? { products: productsFromCategory } : {}) }, flow };
  }

  // Last chance: a direct product match (e.g. a brand or model name)
  const found = findProducts(input);
  if (found.length > 0) {
    return { reply: { text: "J'ai trouvé ceci dans notre catalogue 👇", products: found, chips: [{ label: "📝 Demander un devis", action: "flow:devis" }] }, flow };
  }

  return { reply: fallbackReply, flow };
}

export function buildQuoteWhatsAppMessage(s: QuoteSummary) {
  return [
    "*Demande de devis — Assistant PBXcom*",
    "",
    s.secteurName ? `• Secteur : ${s.secteurName}` : "",
    s.besoinName ? `• Besoin : ${s.besoinName}` : "",
    s.description ? `• Projet : ${s.description}` : "",
    s.nom ? `• Nom : ${s.nom}` : "",
    s.telephone ? `• Téléphone : ${s.telephone}` : "",
    "",
    "Merci de me rappeler pour confirmer mon devis.",
  ]
    .filter((l, i, arr) => l !== "" || arr[i - 1] !== "")
    .join("\n");
}

export function quoteFormHref(s: QuoteSummary) {
  const params = new URLSearchParams();
  if (s.secteur && s.secteur !== "autre") params.set("secteur", s.secteur);
  if (s.besoin && s.besoin !== "autre") params.set("besoin", s.besoin);
  const q = params.toString();
  return `/devis${q ? `?${q}` : ""}`;
}
