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
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, projects, students, resetDemoData } = useProjectForgeStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const openRolesCount = projects.reduce(
    (acc, p) => acc + p.openRoles.filter((r) => r.status === 'open').length,
    0
  );

  return (
    <header className="border-b border-[#232933] bg-[#0D0F12]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('discovery')}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  Project<span className="text-amber-500">Forge</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  COLLAB ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Campus Engineering Teams & Skill Matching</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'discovery'
                  ? 'bg-[#1E232B] text-amber-400 border border-[#2D3540] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Project Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all relative ${
                activeTab === 'matching'
                  ? 'bg-[#1E232B] text-amber-400 border border-[#2D3540] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Skill Matcher</span>
              {openRolesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold">
                  {openRolesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'kanban'
                  ? 'bg-[#1E232B] text-amber-400 border border-[#2D3540] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-purple-400" />
              <span>Kanban Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'heatmap'
                  ? 'bg-[#1E232B] text-amber-400 border border-[#2D3540] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contribution Heatmap</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'students'
                  ? 'bg-[#1E232B] text-amber-400 border border-[#2D3540] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Dev Directory ({students.length})</span>
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[#14171D] border border-[#232933] text-xs font-mono">
              <span className="text-slate-500">OPEN ROLES:</span>
              <span className="font-bold text-amber-400">{openRolesCount}</span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all"
              title="Reset seeded simulation data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14171D] border border-[#2D3540] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-white">Reset Demo State?</h3>
            <p className="text-xs text-slate-400 mt-2">
              This will re-initialize all engineering projects, recruitments, and Kanban tasks back to original seeded defaults.
            </p>
            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
