import { NextRequest, NextResponse } from "next/server";
import { generateFallbackContent } from "@/lib/generator";
import { generateWithOpenAI } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
const FREE_DAILY_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in to generate content." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const niche = (body?.niche || "").toString().slice(0, 120);

    if (!niche.trim()) {
      return NextResponse.json(
        { error: "Please provide a business type or niche." },
        { status: 400 }
      );
    }

    // 1. Check plan + today's usage.
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const isPro = profile?.plan === "pro";

    if (!isPro) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: usage } = await supabase
        .from("daily_usage")
        .select("count")
        .eq("user_id", user.id)
        .eq("usage_date", today)
        .single();

      if ((usage?.count || 0) >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error:
              "You've used all your free generations for today. Upgrade to Pro for unlimited access.",
          },
          { status: 403 }
        );
      }
    }

    // 2. Generate content — real AI if configured, otherwise the fallback
    // smart template engine so the app always works.
    let contentBase;
    let source: "openai" | "template" = "template";

    if (process.env.OPENAI_API_KEY) {
      try {
        contentBase = await generateWithOpenAI(niche);
        source = "openai";
      } catch (err) {
        console.error("OpenAI generation failed, using fallback:", err);
      }
    }

    if (!contentBase) {
      const fallback = generateFallbackContent(niche);
      contentBase = {
        caption: fallback.caption,
        hashtags: fallback.hashtags,
        slogan: fallback.slogan,
        script: fallback.script,
        videoPrompt: fallback.videoPrompt,
      };
    }

    // 3. Save the generation to the database.
    const { data: saved, error: saveError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        niche,
        caption: contentBase.caption,
        hashtags: contentBase.hashtags,
        slogan: contentBase.slogan,
        script: contentBase.script,
        video_prompt: contentBase.videoPrompt,
        source,
      })
      .select()
      .single();

    if (saveError || !saved) {
      console.error(saveError);
      return NextResponse.json(
        { error: "Failed to save generation." },
        { status: 500 }
      );
    }

    // 4. Record usage for free-tier accounting (Pro users are unlimited,
    // but we still track it for basic analytics).
    await supabase.rpc("increment_daily_usage");

    return NextResponse.json({
      id: saved.id,
      niche: saved.niche,
      createdAt: saved.created_at,
      caption: saved.caption,
      hashtags: saved.hashtags,
      slogan: saved.slogan,
      script: saved.script,
      videoPrompt: saved.video_prompt,
      source: saved.source,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong generating content." },
      { status: 500 }
    );
  }
}
