import { useState, useMemo } from 'react';
import { LayoutDashboard, BookOpen, BarChart2, Search, X, Car } from 'lucide-react';
import { useProgress } from './hooks/useProgress';
import { THEMES } from './data';
import Dashboard from './components/Dashboard';
import ThemeCard from './components/ThemeCard';
import Statistics from './components/Statistics';

type Tab = 'dashboard' | 'themes' | 'stats';

const DEFAULT_TOTALS: Record<string, number> = {};
for (const theme of THEMES) {
  for (const ch of theme.chapters) {
    DEFAULT_TOTALS[ch.id] = ch.totalQuestions;
  }
}

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [search, setSearch] = useState('');
  const { updateChapter, markComplete, resetChapter, getThemesWithProgress } = useProgress();

  const themes = getThemesWithProgress();

  const filteredThemes = useMemo(() => {
    if (!search.trim()) return themes;
    const q = search.toLowerCase();
    return themes.filter(
      (t) =>
        t.id.includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.chapters.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [themes, search]);

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'themes', label: 'Themes', icon: BookOpen },
    { id: 'stats', label: 'Statistics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 mr-auto">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Car size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">DrivePrep</span>
          </div>
          <nav className="flex gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {tab === 'dashboard' && <Dashboard themes={themes} />}

        {tab === 'themes' && (
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by theme number, name or chapter…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {filteredThemes.length === 0 ? (
              <p className="text-center text-slate-500 py-10">No themes match your search.</p>
            ) : (
              <div className="space-y-3">
                {filteredThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    onUpdateChapter={updateChapter}
                    onMarkComplete={markComplete}
                    onResetChapter={resetChapter}
                    defaultTotals={DEFAULT_TOTALS}
                    searchQuery={search}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'stats' && <Statistics themes={themes} />}
      </main>
    </div>
  );
}
