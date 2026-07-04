"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Crown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Generator } from "@/components/Generator";
import { HistoryList } from "@/components/HistoryList";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-ink-950">
        <Loader2 className="animate-spin text-neon" size={28} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-14 dark:bg-ink-950">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-ink-600 dark:text-slate-400">
                Generate new content or revisit your saved history below.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 px-4 py-2 text-sm font-medium text-ink-700 dark:text-slate-300">
              {user.plan === "pro" ? (
                <>
                  <Crown size={14} className="text-neon" /> Pro Plan
                </>
              ) : (
                <>
                  Free Plan ·{" "}
                  <Link href="/pricing" className="text-neon hover:underline">
                    Upgrade
                  </Link>
                </>
              )}
            </div>
          </div>

          <Generator onGenerated={() => setRefreshKey((k) => k + 1)} />

          <div className="mt-16">
            <h2 className="mb-6 font-display text-xl font-bold text-ink-900 dark:text-white">
              Your generation history
            </h2>
            <HistoryList refreshKey={refreshKey} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
