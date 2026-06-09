import { useState, useEffect } from 'react';
import { X, CheckCircle, RefreshCw, Plus, Minus, CheckCircle2 } from 'lucide-react';
import type { Chapter } from '../types';
import { calcPct, progressTextClass } from '../utils';
import ProgressBar from './ProgressBar';

interface Props {
  chapter: Chapter;
  onClose: () => void;
  onUpdate: (total: number, completed: number) => void;
  onMarkComplete: () => void;
  onReset: () => void;
}

export default function ChapterModal({ chapter, onClose, onUpdate, onMarkComplete, onReset }: Props) {
  const [total, setTotal] = useState(chapter.totalQuestions);
  const [completed, setCompleted] = useState(chapter.completedQuestions);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotal(chapter.totalQuestions);
    setCompleted(chapter.completedQuestions);
  }, [chapter]);

  const pct = calcPct(completed, total);

  function handleTotalChange(val: string) {
    const n = parseInt(val) || 0;
    setTotal(n);
    onUpdate(n, Math.min(completed, n));
  }

  function handleCompletedChange(val: string) {
    const n = Math.max(0, Math.min(parseInt(val) || 0, total));
    setCompleted(n);
    onUpdate(total, n);
  }

  function increment() {
    const n = Math.min(completed + 1, total);
    setCompleted(n);
    onUpdate(total, n);
  }

  function decrement() {
    const n = Math.max(completed - 1, 0);
    setCompleted(n);
    onUpdate(total, n);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-slate-700">
          <div>
            <p className="text-xs text-slate-400 font-mono mb-1">{chapter.id}</p>
            <h3 className="text-lg font-semibold text-white">{chapter.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-end gap-4">
            <span className={`text-4xl font-bold ${progressTextClass(pct)}`}>{pct}%</span>
            <span className="text-slate-400 mb-1 text-sm">{completed} / {total} questions</span>
          </div>
          <ProgressBar pct={pct} height="h-3" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Total Questions</label>
              <input
                type="number"
                min="0"
                value={total}
                onChange={(e) => handleTotalChange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Completed</label>
              <input
                type="number"
                min="0"
                max={total}
                value={completed}
                onChange={(e) => handleCompletedChange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={decrement}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2.5 text-sm transition-colors"
            >
              <Minus size={15} /> Decrease
            </button>
            <button
              onClick={increment}
              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 text-sm transition-colors"
            >
              <Plus size={15} /> Increase
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { onMarkComplete(); onClose(); }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              <CheckCircle size={15} /> Mark Complete
            </button>
            <button
              onClick={() => { onReset(); onClose(); }}
              className="flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-red-900/50 hover:text-red-400 text-slate-300 rounded-lg px-4 py-2.5 text-sm transition-colors"
            >
              <RefreshCw size={15} /> Reset
            </button>
          </div>
        </div>

        {pct === 100 && (
          <div className="px-5 pb-5">
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-xl p-3">
              <CheckCircle2 className="text-green-400" size={18} />
              <span className="text-green-300 text-sm font-medium">Chapter Complete!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
