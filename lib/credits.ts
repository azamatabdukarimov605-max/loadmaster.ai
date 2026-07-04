import { createClient } from "./supabase/client";

export const FREE_DAILY_LIMIT = 3;

/**
 * Reads today's usage count directly from Supabase (RLS allows a user to
 * read only their own row). This is a read-only helper for UI display —
 * the actual enforcement happens server-side in /api/generate, so a user
 * can never bypass their limit by editing client code.
 */
export async function getUsedToday(userId: string): Promise<number> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("daily_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("usage_date", today)
    .single();

  return data?.count || 0;
}

export async function getRemaining(
  userId: string,
  isPro: boolean
): Promise<number> {
  if (isPro) return Infinity;
  const used = await getUsedToday(userId);
  return Math.max(0, FREE_DAILY_LIMIT - used);
}
