import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';

type Tab = ReturnType<typeof useProjectForgeStore.getState>['activeTab'];
const TABS: { id: Tab; label: string }[] = [
  { id: 'discovery', label: 'Teams' },
  { id: 'matching', label: 'Draft' },
  { id: 'kanban', label: 'Board' },
  { id: 'students', label: 'Roster' },
  { id: 'heatmap', label: 'Form' },
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, projects, students, resetDemoData } = useProjectForgeStore();
  const [confirm, setConfirm] = useState(false);
  const open = projects.reduce((a, p) => a + p.openRoles.filter((r) => r.status === 'open').length, 0);

  return (
    <header className="bg-royal-ink sticky top-0 z-40">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-16 flex items-center gap-4 md:gap-8">
        <button onClick={() => setActiveTab('discovery')} className="flex items-center gap-2 shrink-0" aria-label="ProjectForge home">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden><path d="M6 26 L16 5 L26 26 Z" fill="#ffd60a" /></svg>
          <span className="disp font-black text-[18px] hidden sm:inline">ProjectForge</span>
        </button>
        <nav className="flex gap-1 overflow-x-auto" aria-label="Sections">
          {TABS.map((t) => {
            const on = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)} aria-current={on ? 'page' : undefined}
                className={`px-3.5 py-1.5 rounded-full font-bold text-[15px] whitespace-nowrap transition-colors ${on ? 'bg-volt text-royal-ink' : 'text-mist hover:text-white hover:bg-white/10'}`}>
                {t.label}
                {t.id === 'matching' && open > 0 && <span className={`ml-1.5 text-[12px] ${on ? '' : 'text-volt'}`}>{open}</span>}
              </button>
            );
          })}
        </nav>
        <div className="ml-auto hidden lg:flex items-center gap-5 text-[13px] text-mist">
          <span><b className="text-white disp">{projects.length}</b> teams</span>
          <span><b className="text-white disp">{students.length}</b> players</span>
          <span><b className="text-volt disp">{open}</b> open slots</span>
        </div>
        <div className="ml-auto lg:ml-0 shrink-0">
          {confirm ? (
            <span className="flex items-center gap-2 text-[13px]">
              <button className="vbtn !py-1 !px-3 text-[13px]" onClick={() => { resetDemoData(); setConfirm(false); }}>Reset</button>
              <button className="text-mist underline" onClick={() => setConfirm(false)}>Cancel</button>
            </span>
          ) : (
            <button className="text-[13px] text-mist hover:text-volt underline underline-offset-4" onClick={() => setConfirm(true)}>Reset demo</button>
          )}
        </div>
      </div>
    </header>
  );
};
