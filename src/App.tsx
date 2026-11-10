import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { ProjectDiscoveryView } from './components/discovery/ProjectDiscoveryView';
import { SkillMatchingStudio } from './components/matching/SkillMatchingStudio';
import { KanbanBoardView } from './components/kanban/KanbanBoardView';
import { ContributionHeatmapView } from './components/analytics/ContributionHeatmapView';
import { StudentProfilesView } from './components/profiles/StudentProfilesView';
import { useProjectForgeStore } from './store/useProjectForgeStore';
import { Flame, Hammer, Shield } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab } = useProjectForgeStore();

  return (
    <div className="min-h-screen bg-[#12100e] text-stone-200 flex flex-col font-sans selection:bg-[#ea580c]/30 selection:text-[#ea580c]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'discovery' && <ProjectDiscoveryView />}
        {activeTab === 'matching' && <SkillMatchingStudio />}
        {activeTab === 'kanban' && <KanbanBoardView />}
        {activeTab === 'heatmap' && <ContributionHeatmapView />}
        {activeTab === 'students' && <StudentProfilesView />}
      </main>

      <footer className="border-t border-[#2d231b] bg-[#0f0d0b] py-6 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-stone-400">
            <Hammer className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>ProjectForge Industrial Heavy Engineering • Smart Campus Project Portfolio</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Crucible Match Algorithm • Client-Side Kanban Studio • Local Storage
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
