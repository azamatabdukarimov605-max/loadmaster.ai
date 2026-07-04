const USAGE_KEY = "lm_usage";
export const FREE_DAILY_LIMIT = 3;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

interface Usage {
  date: string;
  count: number;
}

function readUsage(userId: string): Usage {
  if (typeof window === "undefined") return { date: todayKey(), count: 0 };
  try {
    const raw = localStorage.getItem(`${USAGE_KEY}_${userId}`);
    const parsed: Usage | null = raw ? JSON.parse(raw) : null;
    if (!parsed || parsed.date !== todayKey()) {
      return { date: todayKey(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function writeUsage(userId: string, usage: Usage) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${USAGE_KEY}_${userId}`, JSON.stringify(usage));
}

export function getUsedToday(userId: string): number {
  return readUsage(userId).count;
}

export function getRemaining(userId: string, isPro: boolean): number {
  if (isPro) return Infinity;
  return Math.max(0, FREE_DAILY_LIMIT - getUsedToday(userId));
}

export function canGenerate(userId: string, isPro: boolean): boolean {
  if (isPro) return true;
  return getUsedToday(userId) < FREE_DAILY_LIMIT;
}

export function recordGeneration(userId: string) {
  const usage = readUsage(userId);
  writeUsage(userId, { date: usage.date, count: usage.count + 1 });
}
