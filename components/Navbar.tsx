"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-700 dark:text-slate-300 transition-colors hover:text-neon"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary !px-4 !py-2 text-sm">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-ink-700 dark:text-slate-300 hover:text-neon"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-700 dark:text-slate-300 hover:text-neon"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary !px-4 !py-2 text-sm">
                Start Free
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 dark:border-white/10 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink-700 dark:text-slate-300"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2">
              <ThemeToggle />
              {user ? (
                <div className="flex gap-3">
                  <Link href="/dashboard" className="btn-secondary !px-4 !py-2 text-sm">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-sm font-medium">
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" className="text-sm font-medium">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-primary !px-4 !py-2 text-sm">
                    Start Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
