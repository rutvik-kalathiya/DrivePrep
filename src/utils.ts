export function calcPct(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function progressColor(pct: number): string {
  if (pct === 100) return '#22c55e';   // green
  if (pct >= 76)   return '#3b82f6';   // blue
  if (pct >= 51)   return '#eab308';   // yellow
  if (pct >= 26)   return '#f97316';   // orange
  return '#ef4444';                     // red
}

export function progressBgClass(pct: number): string {
  if (pct === 100) return 'bg-green-500';
  if (pct >= 76)   return 'bg-blue-500';
  if (pct >= 51)   return 'bg-yellow-500';
  if (pct >= 26)   return 'bg-orange-500';
  return 'bg-red-500';
}

export function progressTextClass(pct: number): string {
  if (pct === 100) return 'text-green-400';
  if (pct >= 76)   return 'text-blue-400';
  if (pct >= 51)   return 'text-yellow-400';
  if (pct >= 26)   return 'text-orange-400';
  return 'text-red-400';
}
