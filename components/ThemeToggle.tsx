"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/15 text-ink-900 dark:text-white transition-all hover:border-neon/60 hover:text-neon"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
