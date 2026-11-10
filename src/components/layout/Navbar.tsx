import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { 
  Flame, 
  Layers, 
  Target, 
  Kanban, 
  Activity, 
  Users, 
  RotateCcw,
  Sparkles,
  Hammer,
  Shield,
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, projects, students, resetDemoData } = useProjectForgeStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const openRolesCount = projects.reduce(
    (acc, p) => acc + p.openRoles.filter((r) => r.status === 'open').length,
    0
  );

  const navTabs = [
    { id: 'discovery' as const, label: 'Foundry Hub', icon: Layers, count: projects.length },
    { id: 'matching' as const, label: 'Skill Smelter', icon: Target, badge: openRolesCount > 0 ? `${openRolesCount} OPEN` : undefined },
    { id: 'kanban' as const, label: 'Sprint Conveyor', icon: Kanban },
    { id: 'heatmap' as const, label: 'Crucible Heatmap', icon: Activity },
    { id: 'students' as const, label: 'Artisan Guild', icon: Users, count: students.length },
  ];

  return (
    <header className="border-b border-[#2d231b] bg-[#15120f]/95 backdrop-blur sticky top-0 z-40 select-none">
      {/* Top Crucible Temperature Ticker */}
      <div className="bg-[#110e0c] border-b border-[#241c16] px-4 py-1.5 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-amber-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
            <span>BLAST FURNACE: 1,480°C</span>
          </div>
          <span className="text-[#3d3128] hidden sm:inline">•</span>
          <span className="text-stone-400 hidden sm:inline">
            ENGINEERING WORKSPACES ACTIVE
          </span>
        </div>
        <div className="flex items-center space-x-3 text-stone-400">
          <span>{projects.length} VENTURES FORGING</span>
          <span className="text-[#3d3128]">•</span>
          <span className="text-amber-500 font-semibold">{openRolesCount} CREW VACANCIES</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('discovery')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#9a3412] p-0.5 shadow-lg shadow-orange-950/40">
              <div className="w-full h-full bg-[#171310] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#ea580c]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  Project<span className="text-[#ea580c]">Forge</span>
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#2e1c12] text-[#ea580c] border border-[#ea580c]/30 font-mono tracking-wider">
                  FOUNDRY v2
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">Collaborative Engineering Teams & Skill Matching</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                    isActive
                      ? 'bg-[#291f17] text-[#ea580c] border border-[#ea580c]/40 shadow-[0_0_12px_rgba(234,88,12,0.15)] font-bold'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-[#201914] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ea580c]' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#ea580c]/20 text-[#ea580c] border border-[#ea580c]/30 font-bold animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && !tab.badge && (
                    <span className="text-[10px] text-stone-500 font-mono">
                      ({tab.count})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#201914] hover:bg-[#2c221a] text-stone-300 hover:text-white border border-[#3b2d22] flex items-center space-x-1.5 transition-all"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#ea580c]" />
              <span className="hidden sm:inline">Reset Foundry</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-[#2d231b] no-scrollbar">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-mono ${
                activeTab === tab.id 
                  ? 'bg-[#291f17] text-[#ea580c] border border-[#ea580c]/40 font-bold' 
                  : 'text-stone-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1613] border border-[#ea580c]/40 rounded-xl max-w-sm w-full p-5 shadow-2xl font-mono text-stone-200">
            <div className="flex items-center space-x-3 text-[#ea580c] mb-3">
              <RotateCcw className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Reset Foundry State?</h3>
            </div>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed font-sans">
              This will reforge all 8 seeded engineering projects, reseed 32 artisan student profiles, restore sprint tasks to original columns, and clear custom modifications.
            </p>
            <div className="flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-md text-stone-400 hover:text-white hover:bg-[#28201a]"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-md bg-[#ea580c] hover:bg-[#f97316] text-stone-950 font-black shadow-lg shadow-orange-950/40"
              >
                CONFIRM REFORGE
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
