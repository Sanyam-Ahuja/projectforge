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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 md:px-8 py-10">
        {activeTab === 'discovery' && <ProjectDiscoveryView />}
        {activeTab === 'matching' && <SkillMatchingStudio />}
        {activeTab === 'kanban' && <KanbanBoardView />}
        {activeTab === 'heatmap' && <ContributionHeatmapView />}
        {activeTab === 'students' && <StudentProfilesView />}
      </main>
      <footer className="max-w-[1360px] w-full mx-auto px-4 md:px-8 py-6 text-[13px] text-mist/70">
        Demo data · changes are saved in this browser only
      </footer>
    </div>
  );
};

export default App;
