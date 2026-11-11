import { readStorage, writeStorage } from "./storage";

const KEY = "pbxcom-recently-viewed";
const MAX = 8;

export function pushRecentlyViewed(slug: string) {
  const list = readStorage<string[]>(KEY, []).filter((s) => s !== slug);
  writeStorage(KEY, [slug, ...list].slice(0, MAX));
}

export function getRecentlyViewed(exclude?: string): string[] {
  return readStorage<string[]>(KEY, []).filter((s) => s !== exclude);
}
