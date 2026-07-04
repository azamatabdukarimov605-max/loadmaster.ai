import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white py-20 dark:bg-ink-950 min-h-[70vh]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-extrabold text-ink-900 dark:text-white">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-ink-600 dark:text-slate-400">
              Start free with 3 generations a day. Upgrade to Pro anytime for
              unlimited access.
            </p>
          </div>
          <div className="mt-16">
            <PricingCards />
          </div>

          <div className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-center font-display text-2xl font-bold text-ink-900 dark:text-white">
              Frequently asked questions
            </h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  q: "Do I need a credit card to start?",
                  a: "No. The Free plan gives you 3 generations per day with no credit card required.",
                },
                {
                  q: "Can I cancel Pro anytime?",
                  a: "Yes, you can upgrade or downgrade at any time from your dashboard.",
                },
                {
                  q: "What AI powers the content generation?",
                  a: "LoadMaster AI uses a large language model when configured, with a built-in smart template engine as a reliable fallback so you always get results.",
                },
              ].map((item) => (
                <div key={item.q} className="card p-6">
                  <h3 className="font-semibold text-ink-900 dark:text-white">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm text-ink-600 dark:text-slate-400">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
