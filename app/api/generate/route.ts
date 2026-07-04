import { NextRequest, NextResponse } from "next/server";
import { generateFallbackContent } from "@/lib/generator";
import { generateWithOpenAI } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const niche = (body?.niche || "").toString().slice(0, 120);

    if (!niche.trim()) {
      return NextResponse.json(
        { error: "Please provide a business type or niche." },
        { status: 400 }
      );
    }

    // Try real AI first if an API key is configured, otherwise use the
    // built-in smart template engine so the app always works.
    if (process.env.OPENAI_API_KEY) {
      try {
        const aiResult = await generateWithOpenAI(niche);
        return NextResponse.json({
          id: `gen_${Date.now()}`,
          niche,
          createdAt: new Date().toISOString(),
          source: "openai",
          ...aiResult,
        });
      } catch (err) {
        console.error("OpenAI generation failed, using fallback:", err);
      }
    }

    const fallback = generateFallbackContent(niche);
    return NextResponse.json({ ...fallback, source: "template" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong generating content." },
      { status: 500 }
    );
  }
}
