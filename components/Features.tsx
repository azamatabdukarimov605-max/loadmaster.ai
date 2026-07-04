import {
  Captions,
  Hash,
  Sparkle,
  Clapperboard,
  Film,
  History,
} from "lucide-react";

const features = [
  {
    icon: Captions,
    title: "Viral Captions",
    desc: "Scroll-stopping Instagram & TikTok captions tuned for the logistics industry.",
  },
  {
    icon: Hash,
    title: "Smart Hashtags",
    desc: "10-15 relevant hashtags generated instantly to maximize your reach.",
  },
  {
    icon: Sparkle,
    title: "Brand Slogans",
    desc: "Punchy, memorable slogans that make your fleet stand out.",
  },
  {
    icon: Clapperboard,
    title: "Video Scripts",
    desc: "4-6 scene short-form video scripts ready to film or hand to your team.",
  },
  {
    icon: Film,
    title: "AI Video Prompts",
    desc: "Cinematic prompts built for Runway, Pika, and Luma out of the box.",
  },
  {
    icon: History,
    title: "Saved History",
    desc: "Every generation is saved to your dashboard — copy, export, or share anytime.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-24 dark:bg-ink-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white sm:text-4xl">
            Everything you need to market your fleet
          </h2>
          <p className="mt-4 text-ink-600 dark:text-slate-400">
            One input. Five ready-to-post assets. Built specifically for
            trucking, freight, and logistics brands.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card group p-7 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-neon/10 text-neon transition-shadow group-hover:shadow-neon">
                <f.icon size={20} />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-600 dark:text-slate-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
