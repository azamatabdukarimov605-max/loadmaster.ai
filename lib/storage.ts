import { GeneratedContent } from "./types";

/**
 * Thin client-side wrapper around the /api/generations route, which reads
 * and writes to Supabase under Row Level Security (a user can only ever
 * see or delete their own rows).
 */

export async function getHistory(): Promise<GeneratedContent[]> {
  const res = await fetch("/api/generations");
  if (!res.ok) return [];
  const data = await res.json();
  return data.history || [];
}

export async function deleteHistoryItem(id: string): Promise<boolean> {
  const res = await fetch("/api/generations", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.ok;
}
