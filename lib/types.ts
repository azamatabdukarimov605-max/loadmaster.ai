export interface GeneratedContent {
  id: string;
  niche: string;
  createdAt: string;
  caption: string;
  hashtags: string[];
  slogan: string;
  script: ScriptScene[];
  videoPrompt: string;
}

export interface ScriptScene {
  scene: number;
  title: string;
  visual: string;
  voiceover: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro";
  createdAt: string;
}

export interface DailyUsage {
  date: string;
  count: number;
}
