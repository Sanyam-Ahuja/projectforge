import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { Activity, GitCommit, GitPullRequest, Star, Calendar, Zap } from 'lucide-react';

export const ContributionHeatmapView: React.FC = () => {
  const { students, projects, kanbanTasks } = useProjectForgeStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'stu-1');

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Aggregate project velocity
  const totalCommits = students.reduce((acc, s) => acc + s.githubStats.commits, 0);
  const totalPrs = students.reduce((acc, s) => acc + s.githubStats.prs, 0);
  const completedTasks = kanbanTasks.filter((t) => t.status === 'done').length;

  const getActivityColor = (level: number) => {
    if (level === 0) return 'bg-[#161B22]';
    if (level <= 3) return 'bg-amber-950/80 border border-amber-900/60';
    if (level <= 6) return 'bg-amber-700/80';
    if (level <= 8) return 'bg-amber-500';
    return 'bg-amber-400 shadow-sm shadow-amber-400/50';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
            Engineering Velocity
          </span>
          <span className="text-xs text-slate-500 font-mono">52-Week Rolling Commit Telemetry</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">Campus Engineering Contribution Analytics</h2>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Inspect student engineering consistency, open-source commit cadences, and sprint completion volume across active campus projects.
        </p>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL COMMITS</span>
            <GitCommit className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalCommits.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Across all repositories</p>
        </div>

        <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>MERGED PULL REQUESTS</span>
            <GitPullRequest className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            {totalPrs}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Peer-reviewed codebase additions</p>
        </div>

        <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TASKS COMPLETED</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {completedTasks}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Shipped in current sprints</p>
        </div>

        <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE CONTRIBUTORS</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {students.length}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Registered student engineers</p>
        </div>
      </div>

      {/* Main Student Heatmap Section */}
      <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232933] pb-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#2D3540]"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{currentStudent.name}</h3>
                <span className="text-xs font-mono text-amber-400">@{currentStudent.handle}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentStudent.year} • {currentStudent.major}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-mono">Select Contributor:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 bg-[#0D0F12] border border-[#232933] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 52-Week GitHub Heatmap */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-mono">
              {currentStudent.contributionActivity.reduce((a, b) => a + b, 0)} contributions in the last year
            </span>
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-500">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-sm bg-[#161B22]" />
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-950/80" />
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-700/80" />
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span>More</span>
            </div>
          </div>

          {/* Grid of Weeks (52 columns x 4 rows) */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[700px] flex gap-1.5 p-3 rounded-xl bg-[#0D0F12] border border-[#232933]">
              {currentStudent.contributionActivity.map((count, weekIdx) => (
                <div key={weekIdx} className="flex-1 flex flex-col gap-1.5" title={`Week ${weekIdx + 1}: ${count} commits`}>
                  {Array.from({ length: 4 }).map((_, dayIdx) => {
                    const jitter = ((weekIdx * 7 + dayIdx * 3) % count) + (count > 0 ? 1 : 0);
                    return (
                      <div
                        key={dayIdx}
                        className={`h-3 w-full rounded-xs transition-colors ${getActivityColor(jitter)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-[#0D0F12] rounded-xl border border-[#232933] flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Git Commits:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {currentStudent.githubStats.commits}
            </span>
          </div>

          <div className="p-3 bg-[#0D0F12] rounded-xl border border-[#232933] flex items-center justify-between">
            <span className="text-xs text-slate-400">Pull Requests Merged:</span>
            <span className="font-mono font-bold text-purple-400 text-sm">
              {currentStudent.githubStats.prs}
            </span>
          </div>

          <div className="p-3 bg-[#0D0F12] rounded-xl border border-[#232933] flex items-center justify-between">
            <span className="text-xs text-slate-400">Weekly Bandwidth:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {currentStudent.availabilityHoursPerWeek} hrs / wk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
