import { progressBgClass } from '../utils';

interface Props {
  pct: number;
  height?: string;
}

export default function ProgressBar({ pct, height = 'h-2' }: Props) {
  return (
    <div className={`w-full ${height} bg-slate-700 rounded-full overflow-hidden`}>
      <div
        className={`${height} ${progressBgClass(pct)} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
