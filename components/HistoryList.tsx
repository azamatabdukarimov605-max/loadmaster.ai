"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { GeneratedContent } from "@/lib/types";
import { deleteHistoryItem, getHistory } from "@/lib/storage";
import { ResultCard } from "./ResultCard";

export function HistoryList({ userId }: { userId: string }) {
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory(userId));
  }, [userId]);

  const handleDelete = (id: string) => {
    deleteHistoryItem(userId, id);
    setHistory((h) => h.filter((item) => item.id !== id));
  };

  if (history.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-ink-500 dark:text-slate-400">
        No generations yet. Create your first one above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="card flex w-full items-center justify-between p-5 text-left transition-colors hover:border-neon/40"
            >
              <div>
                <p className="font-semibold text-ink-900 dark:text-white">
                  {item.niche}
                </p>
                <p className="text-xs text-ink-500 dark:text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="rounded-lg p-2 text-ink-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
            {isOpen && (
              <div className="mt-3">
                <ResultCard content={item} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
