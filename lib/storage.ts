import { GeneratedContent } from "./types";

const HISTORY_KEY = "lm_history";

export function getHistory(userId: string): GeneratedContent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${HISTORY_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(userId: string, item: GeneratedContent) {
  if (typeof window === "undefined") return;
  const history = getHistory(userId);
  const updated = [item, ...history].slice(0, 100);
  localStorage.setItem(`${HISTORY_KEY}_${userId}`, JSON.stringify(updated));
}

export function clearHistory(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${HISTORY_KEY}_${userId}`);
}

export function deleteHistoryItem(userId: string, id: string) {
  if (typeof window === "undefined") return;
  const history = getHistory(userId).filter((h) => h.id !== id);
  localStorage.setItem(`${HISTORY_KEY}_${userId}`, JSON.stringify(history));
}
