import { useMemo } from 'react';
import { BookOpen, CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';
import type { Theme } from '../types';
import { calcPct, progressTextClass } from '../utils';
import ProgressBar from './ProgressBar';

interface Props {
  themes: Theme[];
}

export default function Dashboard({ themes }: Props) {
  const stats = useMemo(() => {
    let totalChapters = 0;
    let completedChapters = 0;
    let totalQ = 0;
    let completedQ = 0;

    for (const theme of themes) {
      for (const ch of theme.chapters) {
        totalChapters++;
        totalQ += ch.totalQuestions;
        completedQ += ch.completedQuestions;
        if (ch.totalQuestions > 0 && ch.completedQuestions === ch.totalQuestions) {
          completedChapters++;
        }
      }
    }

    return { totalChapters, completedChapters, totalQ, completedQ };
  }, [themes]);

  const overallPct = calcPct(stats.completedQ, stats.totalQ);

  const cards = [
    { label: 'Total Chapters', value: stats.totalChapters, icon: BookOpen, color: 'text-purple-400' },
    { label: 'Chapters Done', value: stats.completedChapters, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Questions Done', value: stats.completedQ, icon: Target, color: 'text-blue-400' },
    { label: 'Remaining', value: Math.max(0, stats.totalQ - stats.completedQ), icon: Clock, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-blue-400" size={22} />
          <h2 className="text-lg font-semibold text-white">Overall Progress</h2>
        </div>
        <div className="flex items-end gap-4 mb-3">
          <span className={`text-5xl font-bold ${progressTextClass(overallPct)}`}>{overallPct}%</span>
          <span className="text-slate-400 mb-2 text-sm">{stats.completedQ} / {stats.totalQ} questions</span>
        </div>
        <ProgressBar pct={overallPct} height="h-4" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <Icon className={`${color} mb-2`} size={20} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
