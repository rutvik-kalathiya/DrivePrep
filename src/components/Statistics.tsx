import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, AlertTriangle } from 'lucide-react';
import type { Theme } from '../types';
import { calcPct, progressColor } from '../utils';

interface Props {
  themes: Theme[];
}

export default function Statistics({ themes }: Props) {
  const data = useMemo(() => {
    return themes.map((theme) => {
      const totalQ = theme.chapters.reduce((s, c) => s + c.totalQuestions, 0);
      const completedQ = theme.chapters.reduce((s, c) => s + c.completedQuestions, 0);
      const completedCh = theme.chapters.filter(
        (c) => c.totalQuestions > 0 && c.completedQuestions === c.totalQuestions
      ).length;
      const pct = calcPct(completedQ, totalQ);
      return { id: theme.id, title: theme.title, pct, totalQ, completedQ, completedCh, totalCh: theme.chapters.length };
    });
  }, [themes]);

  const sortedByPct = [...data].sort((a, b) => b.pct - a.pct);
  const most = sortedByPct.find((d) => d.pct > 0) ?? sortedByPct[0];
  const least = sortedByPct[sortedByPct.length - 1];

  const totalCompletedCh = data.reduce((s, d) => s + d.completedCh, 0);
  const totalCh = data.reduce((s, d) => s + d.totalCh, 0);

  const chartData = data.map((d) => ({ name: d.id, pct: d.pct }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400">Chapters Completed</p>
          <p className="text-3xl font-bold text-white mt-1">{totalCompletedCh}</p>
          <p className="text-xs text-slate-500 mt-1">of {totalCh} total</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400">Chapters Remaining</p>
          <p className="text-3xl font-bold text-white mt-1">{totalCh - totalCompletedCh}</p>
          <p className="text-xs text-slate-500 mt-1">to complete</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-slate-800 rounded-xl p-4 border border-green-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-yellow-400" />
            <p className="text-xs text-slate-400">Most Completed Theme</p>
          </div>
          <p className="text-white font-semibold">{most.id} – {most.title}</p>
          <p className="text-green-400 text-2xl font-bold mt-1">{most.pct}%</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-red-800/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-400" />
            <p className="text-xs text-slate-400">Least Completed Theme</p>
          </div>
          <p className="text-white font-semibold">{least.id} – {least.title}</p>
          <p className="text-red-400 text-2xl font-bold mt-1">{least.pct}%</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">Completion by Theme</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value) => [`${value}%`, 'Completion']}
              />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={progressColor(entry.pct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <h3 className="text-white font-semibold mb-3">Completion by Theme (%)</h3>
        <div className="space-y-2">
          {sortedByPct.map((d) => (
            <div key={d.id} className="flex items-center gap-3 text-sm">
              <span className="text-slate-400 font-mono w-8 flex-shrink-0">{d.id}</span>
              <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${d.pct}%`, background: progressColor(d.pct) }}
                />
              </div>
              <span className="text-white w-10 text-right font-semibold">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
