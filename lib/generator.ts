import { GeneratedContent, ScriptScene } from "./types";

/**
 * Smart template-based generator.
 * Used automatically when no OPENAI_API_KEY is configured, so the app
 * is fully functional out of the box with zero external dependencies.
 */

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const CAPTION_TEMPLATES = [
  "Every mile matters. {niche} that never stops moving. 🚛💨",
  "While you sleep, our wheels never do. Welcome to the future of {niche}. ⚡🌎",
  "Freight moves the world. We move the freight. {niche} done right. 🔥",
  "From dock to destination — {niche} that delivers, every single time. 📦🛣️",
  "This isn't just logistics. This is {niche} on another level. 🚀",
  "Behind every shelf, every store, every home — there's a truck. That's us. {niche}. 🛻",
  "We don't chase deadlines. We beat them. {niche} built different. ⏱️🔥",
  "The road is long, but our commitment is longer. {niche} you can trust. 🛣️",
];

const SLOGAN_TEMPLATES = [
  "Moving More Than Freight — Moving Forward.",
  "Delivered On Time. Delivered On Trust.",
  "Where Every Mile Has a Mission.",
  "Powering the Supply Chain, One Load at a Time.",
  "Reliable Roads. Relentless Results.",
  "Your Cargo. Our Commitment.",
  "Driven by Purpose, Delivered with Precision.",
  "The Road Belongs to Those Who Deliver.",
];

const HASHTAG_POOL = [
  "Trucking",
  "TruckingLife",
  "Logistics",
  "FreightLife",
  "SupplyChain",
  "TruckerLife",
  "TruckingIndustry",
  "Freight",
  "Transportation",
  "TruckDriver",
  "LogisticsCompany",
  "OwnerOperator",
  "TruckingBusiness",
  "OTR",
  "FleetManagement",
  "CDL",
  "AmericanTrucker",
  "RoadWarrior",
  "DeliveredOnTime",
  "MoveAmerica",
  "TruckNation",
  "HaulingIt",
  "18Wheeler",
  "SmallFleet",
  "LogisticsSolutions",
];

const SCENE_LIBRARY: ((niche: string) => ScriptScene)[] = [
  (niche) => ({
    scene: 1,
    title: "Opening Hook",
    visual: `Sunrise time-lapse of a fleet of trucks lined up at a ${niche} yard, engines starting, mist rolling off the asphalt.`,
    voiceover: "Before the world wakes up, we're already moving.",
  }),
  (niche) => ({
    scene: 2,
    title: "The Problem",
    visual: `Split-screen: empty shelves vs. a loaded ${niche} truck pulling onto the highway.`,
    voiceover: "Every product has a story. It starts with a truck.",
  }),
  (niche) => ({
    scene: 3,
    title: "The Solution / Brand Reveal",
    visual: `Drone shot flying over a highway at golden hour, logo animates onto the side of the trailer.`,
    voiceover: "That's where we come in — reliable, relentless, on time.",
  }),
  (niche) => ({
    scene: 4,
    title: "Proof / Trust",
    visual: `Quick cuts: driver checking cargo, dispatcher on a call, GPS tracking map glowing with routes.`,
    voiceover: "Real people. Real routes. Real results, every day.",
  }),
  (niche) => ({
    scene: 5,
    title: "Emotional Payoff",
    visual: `A family receiving a package at their doorstep, smiling; cut back to the truck driving into the sunset.`,
    voiceover: "Because behind every delivery, there's someone waiting.",
  }),
  (niche) => ({
    scene: 6,
    title: "Call To Action",
    visual: `Logo lockup on a dark gradient background with neon blue route lines animating across a map.`,
    voiceover: "Ready to move your business forward? Let's roll.",
  }),
];

const VIDEO_PROMPT_TEMPLATES = [
  "Cinematic drone shot flying low over an American highway at golden hour, a fleet of modern {niche} trucks driving in formation, lens flare, volumetric fog, neon blue brand accents on trailers, hyperrealistic, 4k, dynamic camera movement, shallow depth of field, epic commercial style.",
  "Time-lapse of a busy logistics hub at night, {niche} trucks loading under bright warehouse lights, light trails from moving vehicles, futuristic glowing route lines overlaid on the scene like a digital map, cinematic color grade, ultra-detailed.",
  "Slow-motion tracking shot alongside a semi-truck on an open desert highway, dust kicking up behind the wheels, dramatic sky, {niche} branding on the trailer, cinematic lighting, anamorphic lens flare, commercial-grade realism.",
  "Aerial hyperlapse over a city skyline transitioning into a highway network glowing with animated blue delivery routes, {niche} trucks moving along the lines like a living map, sleek tech-corporate aesthetic, 4k render.",
];

const CTA_WORDS = [
  "Fleet",
  "Freight Co.",
  "Logistics",
  "Transport",
  "Carriers",
  "Haulers",
];

export function generateFallbackContent(niche: string): GeneratedContent {
  const cleanNiche = niche.trim() || "trucking company";
  const seed = hashSeed(cleanNiche + Date.now().toString());

  const caption = pick(CAPTION_TEMPLATES, seed).replace(
    /{niche}/g,
    cleanNiche
  );
  const slogan = pick(SLOGAN_TEMPLATES, seed + 3);
  const videoPrompt = pick(VIDEO_PROMPT_TEMPLATES, seed + 5).replace(
    /{niche}/g,
    cleanNiche
  );

  // Build 10-15 relevant hashtags
  const shuffled = [...HASHTAG_POOL].sort(
    (a, b) => ((hashSeed(a) + seed) % 7) - ((hashSeed(b) + seed) % 7)
  );
  const nicheTag = cleanNiche
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  const hashtagCount = 10 + (seed % 6); // 10-15
  const hashtags = [
    `#${nicheTag || "Logistics"}`,
    ...shuffled.slice(0, hashtagCount - 1).map((t) => `#${t}`),
  ];

  const script: ScriptScene[] = SCENE_LIBRARY.map((fn) => fn(cleanNiche));

  return {
    id: `gen_${Date.now()}_${seed}`,
    niche: cleanNiche,
    createdAt: new Date().toISOString(),
    caption,
    hashtags,
    slogan,
    script,
    videoPrompt,
  };
}
