import { GeneratedContent } from "./types";

const SYSTEM_PROMPT = `You are LoadMaster AI, an expert marketing copywriter for trucking, freight, and logistics companies.
Given a business type/niche, respond ONLY with strict JSON (no markdown, no backticks, no commentary) matching exactly this shape:

{
  "caption": string,               // one viral Instagram/TikTok caption with emojis
  "hashtags": string[],            // 10-15 relevant hashtags, each starting with #
  "slogan": string,                // one short punchy brand slogan
  "script": [                      // 4-6 scenes
    { "scene": number, "title": string, "visual": string, "voiceover": string }
  ],
  "videoPrompt": string            // one detailed AI video generation prompt for Runway/Pika/Luma
}`;

export async function generateWithOpenAI(
  niche: string
): Promise<Omit<GeneratedContent, "id" | "createdAt" | "niche">> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Business type/niche: ${niche}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI");

  const parsed = JSON.parse(text);
  return parsed;
}
