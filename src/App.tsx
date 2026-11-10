import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { ProjectDiscoveryView } from './components/discovery/ProjectDiscoveryView';
import { SkillMatchingStudio } from './components/matching/SkillMatchingStudio';
import { KanbanBoardView } from './components/kanban/KanbanBoardView';
import { ContributionHeatmapView } from './components/analytics/ContributionHeatmapView';
import { StudentProfilesView } from './components/profiles/StudentProfilesView';
import { useProjectForgeStore } from './store/useProjectForgeStore';

export const App: React.FC = () => {
  const { activeTab } = useProjectForgeStore();

  return (
    <div className="min-h-screen bg-[#0D0F12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'discovery' && <ProjectDiscoveryView />}
        {activeTab === 'matching' && <SkillMatchingStudio />}
        {activeTab === 'kanban' && <KanbanBoardView />}
        {activeTab === 'heatmap' && <ContributionHeatmapView />}
        {activeTab === 'students' && <StudentProfilesView />}
      </main>

      <footer className="border-t border-[#232933] bg-[#090A0D] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ProjectForge — Technical Collaboration & Skill Matching Engine</p>
          <p className="font-mono text-[11px] text-slate-400">
            Multi-Factor Skill Matrix • In-Browser Sprint Workspace • Local Persistence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
