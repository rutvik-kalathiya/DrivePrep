import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import type { Theme, Chapter } from '../types';
import { calcPct, progressTextClass } from '../utils';
import ProgressBar from './ProgressBar';
import ChapterModal from './ChapterModal';

interface Props {
  theme: Theme;
  onUpdateChapter: (chapterId: string, total: number, completed: number) => void;
  onMarkComplete: (chapterId: string, total: number) => void;
  onResetChapter: (chapterId: string, defaultTotal: number) => void;
  defaultTotals: Record<string, number>;
  searchQuery: string;
}

export default function ThemeCard({ theme, onUpdateChapter, onMarkComplete, onResetChapter, defaultTotals, searchQuery }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const totalQ = theme.chapters.reduce((s, c) => s + c.totalQuestions, 0);
  const completedQ = theme.chapters.reduce((s, c) => s + c.completedQuestions, 0);
  const completedChapters = theme.chapters.filter(
    (c) => c.totalQuestions > 0 && c.completedQuestions === c.totalQuestions
  ).length;
  const pct = calcPct(completedQ, totalQ);

  const isHighlighted =
    searchQuery &&
    (theme.id.includes(searchQuery) ||
      theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.chapters.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <>
      <div
        className={`bg-slate-800 rounded-xl border transition-all ${
          isHighlighted ? 'border-blue-500' : 'border-slate-700'
        }`}
      >
        <button
          className="w-full p-4 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-mono text-slate-400">Theme {theme.id}</span>
              <h3 className="text-white font-semibold mt-0.5">{theme.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {completedChapters}/{theme.chapters.length} chapters · {completedQ}/{totalQ} questions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${progressTextClass(pct)}`}>{pct}%</span>
              {expanded ? (
                <ChevronUp size={18} className="text-slate-400" />
              ) : (
                <ChevronDown size={18} className="text-slate-400" />
              )}
            </div>
          </div>
          <ProgressBar pct={pct} />
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-2 border-t border-slate-700 pt-3">
            {theme.chapters.map((ch) => {
              const chPct = calcPct(ch.completedQuestions, ch.totalQuestions);
              const isChMatch =
                searchQuery && ch.name.toLowerCase().includes(searchQuery.toLowerCase());

              return (
                <button
                  key={ch.id}
                  className={`w-full text-left rounded-lg p-3 transition-colors ${
                    isChMatch ? 'bg-blue-900/40 border border-blue-600' : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                  onClick={() => setSelectedChapter(ch)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {ch.totalQuestions > 0 && ch.completedQuestions === ch.totalQuestions && (
                        <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                      )}
                      <span className="text-sm text-white">{ch.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{ch.completedQuestions}/{ch.totalQuestions}</span>
                      <span className={`font-semibold ${progressTextClass(chPct)}`}>{chPct}%</span>
                    </div>
                  </div>
                  <ProgressBar pct={chPct} height="h-1.5" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedChapter && (
        <ChapterModal
          chapter={selectedChapter}
          onClose={() => setSelectedChapter(null)}
          onUpdate={(total, completed) => {
            onUpdateChapter(selectedChapter.id, total, completed);
            setSelectedChapter({ ...selectedChapter, totalQuestions: total, completedQuestions: completed });
          }}
          onMarkComplete={() => {
            onMarkComplete(selectedChapter.id, selectedChapter.totalQuestions);
            setSelectedChapter(null);
          }}
          onReset={() => {
            onResetChapter(selectedChapter.id, defaultTotals[selectedChapter.id] ?? 0);
            setSelectedChapter(null);
          }}
        />
      )}
    </>
  );
}
