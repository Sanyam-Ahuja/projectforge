import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { Search, GitCommit, GitPullRequest, Star, Clock, Target, ArrowRight } from 'lucide-react';

export const StudentProfilesView: React.FC = () => {
  const { students, setSelectedStudentId, setActiveTab } = useProjectForgeStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.handle.toLowerCase().includes(q) ||
      s.major.toLowerCase().includes(q) ||
      s.skills.some((sk) => sk.skill.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold uppercase">
              Talent Directory
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {students.length} Verified Student Engineers
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Campus Engineering Talent Roster</h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Browse candidate profiles, low-level systems hackers, ML practitioners, and robotics firmware developers.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by skill, name, major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-[#14171D] border border-[#232933] rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start space-x-3.5">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#2D3540] flex-shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{student.name}</h3>
                  <p className="text-[11px] font-mono text-amber-400">@{student.handle}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {student.year} • {student.major}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {student.bio}
              </p>

              {/* Skills with Proficiency Levels */}
              <div className="mt-4 pt-3 border-t border-[#232933]">
                <span className="text-[10px] text-slate-500 font-mono block mb-2 uppercase">
                  Technical Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((s) => (
                    <div
                      key={s.skill}
                      className="px-2 py-1 rounded bg-[#0D0F12] border border-[#232933] text-[10px] font-mono flex items-center space-x-1.5 text-slate-300"
                    >
                      <span>{s.skill}</span>
                      <span className="text-amber-400 font-bold">L{s.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Stats */}
              <div className="mt-4 pt-3 border-t border-[#232933] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center space-x-1">
                  <GitCommit className="w-3.5 h-3.5 text-amber-400" />
                  <span>{student.githubStats.commits} commits</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{student.availabilityHoursPerWeek}h / wk</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#232933]">
              <button
                onClick={() => {
                  setSelectedStudentId(student.id);
                  setActiveTab('matching');
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Find Compatible Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
