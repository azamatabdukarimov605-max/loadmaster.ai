"use client";

import { useState } from "react";
import { Loader2, Sparkles, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { canGenerate, getRemaining, recordGeneration } from "@/lib/credits";
import { saveToHistory } from "@/lib/storage";
import { generateFallbackContent } from "@/lib/generator";
import { GeneratedContent } from "@/lib/types";
import { ResultCard } from "./ResultCard";
import Link from "next/link";

const EXAMPLES = [
  "truck company USA",
  "refrigerated freight carrier",
  "owner-operator trucking",
  "last-mile delivery startup",
  "oversized load hauler",
];

export function Generator() {
  const { user } = useAuth();
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContent | null>(null);

  const isPro = user?.plan === "pro";
  const remaining = user ? getRemaining(user.id, isPro) : 3;

  const handleGenerate = async () => {
    setError(null);

    if (!niche.trim()) {
      setError("Please enter a business type or niche.");
      return;
    }

    if (!user) {
      setError("Please log in to generate content.");
      return;
    }

    if (!canGenerate(user.id, isPro)) {
      setError(
        "You've used all your free generations for today. Upgrade to Pro for unlimited access."
      );
      return;
    }

    setLoading(true);
    try {
      let content: GeneratedContent;
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ niche }),
        });
        if (!res.ok) throw new Error("API error");
        content = await res.json();
      } catch {
        // If the API route is unreachable (e.g. static export), fall back
        // to fully client-side generation so the app still works.
        content = generateFallbackContent(niche);
      }

      recordGeneration(user.id);
      saveToHistory(user.id, content);
      setResult(content);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-6 sm:p-8">
        <label className="mb-2 block text-sm font-semibold text-ink-900 dark:text-white">
          Enter business type or niche
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. truck company USA"
            className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-4 py-3 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 dark:placeholder:text-slate-500 outline-none transition-colors focus:border-neon"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Generate
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setNiche(ex)}
              className="rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs text-ink-600 dark:text-slate-400 transition-colors hover:border-neon/60 hover:text-neon"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          {user ? (
            <span className="text-ink-500 dark:text-slate-400">
              {isPro
                ? "Unlimited generations — Pro plan"
                : `${remaining} of 3 free generations left today`}
            </span>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 font-medium text-neon"
            >
              <Lock size={12} /> Log in to start generating
            </Link>
          )}
          {!isPro && user && (
            <Link href="/pricing" className="font-medium text-neon">
              Upgrade to Pro →
            </Link>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {loading && (
        <div className="card mt-8 space-y-4 p-8">
          <div className="h-4 w-1/3 rounded shimmer-bg" />
          <div className="h-4 w-full rounded shimmer-bg" />
          <div className="h-4 w-5/6 rounded shimmer-bg" />
          <div className="h-24 w-full rounded shimmer-bg" />
        </div>
      )}

      {!loading && result && (
        <div className="mt-8">
          <ResultCard content={result} />
        </div>
      )}
    </div>
  );
}
