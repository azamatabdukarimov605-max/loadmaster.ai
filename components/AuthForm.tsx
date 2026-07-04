"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = isSignup
      ? await signup(name, email, password)
      : await login(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="card mx-auto w-full max-w-md p-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-ink-600 dark:text-slate-400">
        {isSignup
          ? "Start generating logistics marketing content in seconds."
          : "Log in to access your dashboard and saved generations."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isSignup && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700 dark:text-slate-300">
              Full name
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/15 px-4 py-3 focus-within:border-neon">
              <UserIcon size={16} className="text-ink-400" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Carrier"
                className="w-full bg-transparent text-sm text-ink-900 dark:text-white outline-none placeholder:text-ink-400"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-700 dark:text-slate-300">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/15 px-4 py-3 focus-within:border-neon">
            <Mail size={16} className="text-ink-400" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@fleet.com"
              className="w-full bg-transparent text-sm text-ink-900 dark:text-white outline-none placeholder:text-ink-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-700 dark:text-slate-300">
            Password
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/15 px-4 py-3 focus-within:border-neon">
            <Lock size={16} className="text-ink-400" />
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm text-ink-900 dark:text-white outline-none placeholder:text-ink-400"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-70"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isSignup ? (
            "Create account"
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600 dark:text-slate-400">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-neon">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-neon">
              Sign up free
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
