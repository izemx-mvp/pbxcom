const priceFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1250 → "1 250,00 MAD" (narrow no-break spaces normalised to regular no-break spaces) */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value).replace(/ /g, " ")} MAD`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value).replace(/ /g, " ");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

/** Lowercase, strip accents and punctuation — used by search and the chatbot. */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count > 1 ? plural : singular}`;
}
