"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { FREE_DAILY_LIMIT } from "@/lib/credits";

const freeFeatures = [
  `${FREE_DAILY_LIMIT} generations per day`,
  "Captions, hashtags & slogans",
  "Video scripts & AI video prompts",
  "Save to dashboard history",
];

const proFeatures = [
  "Unlimited generations",
  "Everything in Free",
  "Priority generation speed",
  "Export to PDF & TXT",
  "Early access to new features",
];

export function PricingCards() {
  const { user, upgradeToPro } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setUpgrading(true);
    setUpgradeError(null);
    const result = await upgradeToPro();
    setUpgrading(false);
    if (result.error) setUpgradeError(result.error);
  };

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      <div className="card flex flex-col p-8">
        <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white">
          Free
        </h3>
        <p className="mt-2 text-sm text-ink-600 dark:text-slate-400">
          Try LoadMaster AI with no commitment.
        </p>
        <div className="mt-6 flex items-end gap-1">
          <span className="font-display text-4xl font-extrabold text-ink-900 dark:text-white">
            $0
          </span>
          <span className="pb-1 text-sm text-ink-500 dark:text-slate-400">
            /month
          </span>
        </div>
        <ul className="mt-8 flex-1 space-y-3">
          {freeFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-700 dark:text-slate-300">
              <Check size={16} className="mt-0.5 shrink-0 text-neon" />
              {f}
            </li>
          ))}
        </ul>
        <Link
          href={user ? "/dashboard" : "/signup"}
          className="btn-secondary mt-8 w-full"
        >
          {user ? "Go to Dashboard" : "Start Free"}
        </Link>
      </div>

      <div className="card relative flex flex-col overflow-hidden p-8 neon-border">
        <div className="absolute right-6 top-6 flex items-center gap-1 rounded-full bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
          <Zap size={12} /> Most Popular
        </div>
        <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white">
          Pro
        </h3>
        <p className="mt-2 text-sm text-ink-600 dark:text-slate-400">
          For fleets and agencies that post daily.
        </p>
        <div className="mt-6 flex items-end gap-1">
          <span className="font-display text-4xl font-extrabold text-ink-900 dark:text-white">
            $29
          </span>
          <span className="pb-1 text-sm text-ink-500 dark:text-slate-400">
            /month
          </span>
        </div>
        <ul className="mt-8 flex-1 space-y-3">
          {proFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-700 dark:text-slate-300">
              <Check size={16} className="mt-0.5 shrink-0 text-neon" />
              {f}
            </li>
          ))}
        </ul>
        {user ? (
          user.plan === "pro" ? (
            <button disabled className="btn-primary mt-8 w-full opacity-60">
              You're on Pro
            </button>
          ) : (
            <>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="btn-primary mt-8 w-full disabled:opacity-70"
              >
                {upgrading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Upgrade to Pro"
                )}
              </button>
              {upgradeError && (
                <p className="mt-3 rounded-lg bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                  {upgradeError}
                </p>
              )}
            </>
          )
        ) : (
          <Link href="/signup" className="btn-primary mt-8 w-full">
            Get Pro
          </Link>
        )}
      </div>
    </div>
  );
}
