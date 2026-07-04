import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10 bg-white dark:bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-ink-600 dark:text-slate-400">
              AI-powered marketing content for trucking, freight, and
              logistics companies. Generate viral content in seconds.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-ink-600 dark:text-slate-400">
                <li><Link href="/#features" className="hover:text-neon">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-neon">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-neon">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">
                Account
              </h4>
              <ul className="space-y-2 text-sm text-ink-600 dark:text-slate-400">
                <li><Link href="/login" className="hover:text-neon">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-neon">Sign up</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-black/5 dark:border-white/10 pt-6 text-xs text-ink-500 dark:text-slate-500">
          © {new Date().getFullYear()} LoadMaster AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
