import { site } from "@/config/site";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Opens WhatsApp in a new tab. Returns false if the popup was blocked (caller can show the fallback link). */
export function openWhatsApp(message: string): boolean {
  if (typeof window === "undefined") return false;
  const win = window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  return win !== null;
}

/** Build a readable multi-line message from labelled lines, skipping empty values. */
export function formatMessage(title: string, lines: Array<[string, string | undefined | null]>, footer?: string) {
  const body = lines
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `• ${k} : ${v}`)
    .join("\n");
  return [`*${title}*`, "", body, footer ? `\n${footer}` : ""].join("\n").trim();
}

export const defaultWhatsAppMessage = "Bonjour PBXcom, je souhaite obtenir des informations sur vos solutions.";
