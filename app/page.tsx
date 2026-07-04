import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PricingCards } from "@/components/PricingCards";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />

        <section className="bg-white py-24 dark:bg-ink-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-ink-600 dark:text-slate-400">
                Start free. Upgrade whenever your fleet is ready to scale.
              </p>
            </div>
            <div className="mt-16">
              <PricingCards />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-hero-gradient py-24">
          <div className="absolute inset-0 bg-grid-glow" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Ready to move your marketing forward?
            </h2>
            <p className="mt-4 text-slate-300">
              Join trucking and logistics companies generating viral content
              in seconds, not hours.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="btn-primary">
                Start Free <ArrowRight size={18} />
              </Link>
              <Link href="/pricing" className="btn-secondary !text-white !border-white/20">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
