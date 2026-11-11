import type { CartItem } from "./cart";
import { formatPrice } from "./format";
import { readStorage, writeStorage } from "./storage";
import { site } from "@/config/site";

export function generateOrderRef(prefix = "PBX"): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${ymd}-${rand}`;
}

export type OrderCustomer = {
  nom: string;
  telephone: string;
  email: string;
  entreprise?: string;
  ice?: string;
  ville: string;
  adresse: string;
  paiement: string;
  notes?: string;
};

export type SavedOrder = {
  ref: string;
  kind: "commande" | "devis";
  createdAt: string;
  customer: OrderCustomer;
  lines: Array<{ name: string; sku: string; qty: number; unitPrice: number | null; lineTotal: number | null }>;
  subtotal: number;
  needsInstallation: boolean;
  whatsappMessage: string;
};

const LAST_ORDER_KEY = "pbxcom-last-order";

export function saveLastOrder(order: SavedOrder) {
  writeStorage(LAST_ORDER_KEY, order, "session");
}

export function readLastOrder(): SavedOrder | null {
  return readStorage<SavedOrder | null>(LAST_ORDER_KEY, null, "session");
}

export function cartLinesForOrder(items: CartItem[]): SavedOrder["lines"] {
  return items.map((i) => ({
    name: i.product.name,
    sku: i.product.sku,
    qty: i.qty,
    unitPrice: i.product.price,
    lineTotal: i.lineTotal,
  }));
}

export function buildOrderMessage(order: Omit<SavedOrder, "whatsappMessage">): string {
  const isQuote = order.kind === "devis";
  const paymentLabel = site.payment.methods.find((m) => m.id === order.customer.paiement)?.label ?? order.customer.paiement;
  const lines = order.lines
    .map(
      (l) =>
        `• ${l.qty} × ${l.name} (${l.sku}) — ${l.lineTotal === null ? "prix sur demande" : formatPrice(l.lineTotal)}`,
    )
    .join("\n");
  const c = order.customer;
  return [
    `*${isQuote ? "Demande de devis" : "Nouvelle commande"} ${order.ref}*`,
    "",
    "*Articles*",
    lines,
    "",
    order.subtotal > 0 ? `*Sous-total TTC :* ${formatPrice(order.subtotal)}${isQuote ? " (hors articles sur devis)" : ""}` : "",
    `*Livraison :* ${site.delivery.note.toLowerCase()}`,
    order.needsInstallation ? "*Installation :* oui, je souhaite l'installation par vos techniciens" : "",
    "",
    "*Coordonnées*",
    `• Nom : ${c.nom}`,
    `• Téléphone : ${c.telephone}`,
    `• E-mail : ${c.email}`,
    c.entreprise ? `• Entreprise : ${c.entreprise}` : "",
    c.ice ? `• ICE : ${c.ice}` : "",
    `• Ville : ${c.ville}`,
    `• Adresse : ${c.adresse}`,
    isQuote ? "" : `• Paiement : ${paymentLabel}`,
    c.notes ? `• Remarques : ${c.notes}` : "",
    "",
    "Merci de me confirmer la disponibilité et les frais de livraison.",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .filter((line) => line !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
