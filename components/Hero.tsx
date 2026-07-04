import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { RouteNetwork } from "./RouteNetwork";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient grid-bg">
      <div className="absolute inset-0 bg-grid-glow" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-20 md:grid-cols-2 md:pb-32 md:pt-28">
        <div className="animate-fadeUp">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/5 px-4 py-1.5 text-xs font-medium text-neon">
            <Sparkles size={14} />
            AI-powered logistics marketing
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            AI for Logistics Marketing <span className="neon-text">in Seconds</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Generate captions, ads, scripts, and viral content for your
            trucking business instantly.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup" className="btn-primary">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link href="/pricing" className="btn-secondary !text-white !border-white/20">
              Get Pro
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
            <div><span className="font-bold text-white">3</span> free / day</div>
            <div className="h-4 w-px bg-white/15" />
            <div>No credit card required</div>
            <div className="h-4 w-px bg-white/15" />
            <div>Cancel anytime</div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fadeUp [animation-delay:150ms]">
          <RouteNetwork className="w-full drop-shadow-[0_0_40px_rgba(0,212,255,0.25)]" />
        </div>
      </div>
    </section>
  );
}
