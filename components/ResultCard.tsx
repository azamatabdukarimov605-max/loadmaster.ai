"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Share2,
  Hash,
  MessageSquareQuote,
  Sparkles,
  Clapperboard,
  Film,
} from "lucide-react";
import { GeneratedContent } from "@/lib/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/15 px-3 py-1.5 text-xs font-medium text-ink-700 dark:text-slate-300 transition-colors hover:border-neon/60 hover:text-neon"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({
  icon: Icon,
  title,
  copyText,
  children,
}: {
  icon: any;
  title: string;
  copyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/5 dark:border-white/10 py-6 first:pt-0 last:border-0 last:pb-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-900 dark:text-white">
          <Icon size={16} className="text-neon" />
          <h4 className="text-sm font-semibold">{title}</h4>
        </div>
        <CopyButton text={copyText} />
      </div>
      {children}
    </div>
  );
}

function buildTxt(content: GeneratedContent): string {
  return `LOADMASTER AI — GENERATED CONTENT
Niche: ${content.niche}
Generated: ${new Date(content.createdAt).toLocaleString()}

CAPTION
${content.caption}

HASHTAGS
${content.hashtags.join(" ")}

SLOGAN
${content.slogan}

VIDEO SCRIPT
${content.script
  .map(
    (s) =>
      `Scene ${s.scene}: ${s.title}\nVisual: ${s.visual}\nVoiceover: ${s.voiceover}\n`
  )
  .join("\n")}

AI VIDEO PROMPT
${content.videoPrompt}
`;
}

export function ResultCard({ content }: { content: GeneratedContent }) {
  const handleDownloadTxt = () => {
    const blob = new Blob([buildTxt(content)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loadmaster-ai-${content.niche.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const text = buildTxt(content);
    const lines = doc.splitTextToSize(text, 180);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(lines, 15, 15);
    doc.save(`loadmaster-ai-${content.niche.replace(/\s+/g, "-")}.pdf`);
  };

  const handleShare = async () => {
    const shareText = `${content.caption}\n\n${content.hashtags.join(" ")}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LoadMaster AI generation",
          text: shareText,
        });
      } catch {
        // user cancelled share — no-op
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="card animate-fadeUp p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-slate-500">
            Generated for
          </span>
          <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
            {content.niche}
          </h3>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownloadTxt} className="btn-secondary !px-3 !py-2 text-xs">
            <Download size={14} /> TXT
          </button>
          <button onClick={handleDownloadPdf} className="btn-secondary !px-3 !py-2 text-xs">
            <Download size={14} /> PDF
          </button>
          <button onClick={handleShare} className="btn-primary !px-3 !py-2 text-xs">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      <Section icon={MessageSquareQuote} title="Viral Caption" copyText={content.caption}>
        <p className="text-sm leading-relaxed text-ink-700 dark:text-slate-300">
          {content.caption}
        </p>
      </Section>

      <Section icon={Hash} title="Hashtags" copyText={content.hashtags.join(" ")}>
        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neon/10 px-3 py-1 text-xs font-medium text-neon"
            >
              {tag}
            </span>
          ))}
        </div>
      </Section>

      <Section icon={Sparkles} title="Brand Slogan" copyText={content.slogan}>
        <p className="font-display text-base font-bold italic text-ink-900 dark:text-white">
          "{content.slogan}"
        </p>
      </Section>

      <Section
        icon={Clapperboard}
        title="Short Video Script"
        copyText={content.script
          .map((s) => `Scene ${s.scene}: ${s.title}\n${s.visual}\n${s.voiceover}`)
          .join("\n\n")}
      >
        <div className="space-y-4">
          {content.script.map((s) => (
            <div key={s.scene} className="rounded-xl bg-black/[0.03] dark:bg-white/5 p-4">
              <div className="mb-1 text-xs font-semibold text-neon">
                Scene {s.scene} — {s.title}
              </div>
              <p className="text-sm text-ink-700 dark:text-slate-300">
                <span className="font-medium text-ink-900 dark:text-white">Visual: </span>
                {s.visual}
              </p>
              <p className="mt-1 text-sm text-ink-700 dark:text-slate-300">
                <span className="font-medium text-ink-900 dark:text-white">Voiceover: </span>
                "{s.voiceover}"
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Film} title="AI Video Prompt" copyText={content.videoPrompt}>
        <p className="rounded-xl bg-black/[0.03] dark:bg-white/5 p-4 text-sm leading-relaxed text-ink-700 dark:text-slate-300">
          {content.videoPrompt}
        </p>
      </Section>
    </div>
  );
}
