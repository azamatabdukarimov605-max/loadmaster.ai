import Link from "next/link";
import { Truck } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-display font-extrabold tracking-tight ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon/10 text-neon neon-border">
        <Truck size={18} strokeWidth={2.5} />
      </span>
      <span className="text-lg text-ink-900 dark:text-white">
        LoadMaster<span className="neon-text"> AI</span>
      </span>
    </Link>
  );
}
