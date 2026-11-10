import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { rankCandidatesForRole, findMatchingRolesForStudent } from '../../engine/matching';
import { 
  Target, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Clock, 
  GitCommit, 
  Award, 
  UserCheck, 
  UserX,
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const SkillMatchingStudio: React.FC = () => {
  const { 
    projects, 
    students, 
    selectedProjectId, 
    selectedRoleId, 
    setSelectedProjectId, 
    setSelectedRoleId,
    recruitStudentToRole,
    removeStudentFromRole 
  } = useProjectForgeStore();

  const [matchingMode, setMatchingMode] = useState<'byRole' | 'byStudent'>('byRole');
  const [inspectedStudentId, setInspectedStudentId] = useState<string>(students[0]?.id || 'stu-1');

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const currentRole = currentProject?.openRoles.find((r) => r.id === selectedRoleId) || currentProject?.openRoles[0];

  // Candidates ranked for current role
  const rankedCandidates = currentRole
    ? rankCandidatesForRole(students, currentRole, currentProject)
    : [];

  // Open roles for inspected student
  const inspectedStudent = students.find((s) => s.id === inspectedStudentId) || students[0];
  const matchingRolesForStudent = findMatchingRolesForStudent(inspectedStudent, projects);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase">
                Deterministic Skill Matcher
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Coverage • Proficiency • Availability
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Engineering Team Matching Studio</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Multi-criteria skill alignment engine. Prunes skill gaps, scores technical proficiency ratios, and balances weekly bandwidth to match engineering talent to open project roles.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-[#0D0F12] p-1 rounded-xl border border-[#232933] text-xs">
            <button
              onClick={() => setMatchingMode('byRole')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                matchingMode === 'byRole'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Match Candidates to Role
            </button>
            <button
              onClick={() => setMatchingMode('byStudent')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                matchingMode === 'byStudent'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Match Roles to Student
            </button>
          </div>
        </div>
      </div>

      {matchingMode === 'byRole' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Role Selector */}
          <div className="space-y-4">
            <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-3">1. Select Target Project</h3>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      if (proj.openRoles[0]) setSelectedRoleId(proj.openRoles[0].id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      proj.id === selectedProjectId
                        ? 'bg-amber-950/20 border-amber-500/50 text-white shadow-sm'
                        : 'bg-[#0D0F12] border-[#232933] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{proj.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {proj.openRoles.length} roles
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{proj.tagline}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role Selector */}
            {currentProject && (
              <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-3">2. Select Open Role</h3>
                <div className="space-y-2">
                  {currentProject.openRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        role.id === currentRole?.id
                          ? 'bg-amber-500/20 border-amber-500/80 text-white'
                          : 'bg-[#0D0F12] border-[#232933] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{role.title}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                          role.status === 'open'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {role.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {role.requiredSkills.map((req) => (
                          <span
                            key={req.skill}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-900/40"
                          >
                            {req.skill} (L{req.minLevel}+)
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Ranked Candidates */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Candidate Match Rankings for: {currentRole?.title}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Formula: Coverage (50%) + Proficiency (35%) + Bandwidth (15%)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {rankedCandidates.map((cand, idx) => {
                const isAssigned = currentRole?.filledByStudentId === cand.student.id;

                return (
                  <div
                    key={cand.student.id}
                    className={`bg-[#14171D] border rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isAssigned
                        ? 'border-emerald-500/60 bg-emerald-950/10 ring-1 ring-emerald-500/30'
                        : idx === 0
                        ? 'border-amber-500/60 shadow-lg shadow-amber-500/5'
                        : 'border-[#232933] hover:border-slate-700'
                    }`}
                  >
                    {/* Student Info */}
                    <div className="flex items-start space-x-3.5">
                      <div className="relative">
                        <img
                          src={cand.student.avatar}
                          alt={cand.student.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#2D3540]"
                        />
                        <span className={`absolute -top-2 -left-2 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          idx === 0
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{idx + 1}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-white">{cand.student.name}</h4>
                          <span className="text-[11px] font-mono text-slate-500">@{cand.student.handle}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {cand.student.year} • {cand.student.major}
                        </p>

                        {/* Skill Badges */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {cand.breakdown.matchingSkills.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 flex items-center space-x-1"
                            >
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>{s}</span>
                            </span>
                          ))}
                          {cand.breakdown.missingSkills.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/30 text-rose-400 border border-rose-900/40 flex items-center space-x-1"
                            >
                              <XCircle className="w-2.5 h-2.5" />
                              <span>{s}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Score Matrix & Action */}
                    <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-3 md:pt-0 border-[#232933]">
                      {/* Metric pills */}
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                        <div className="bg-[#0D0F12] px-2 py-1 rounded border border-[#232933]">
                          <span className="text-slate-500 block">COV</span>
                          <span className="font-bold text-slate-300">{cand.breakdown.coverageScore}%</span>
                        </div>
                        <div className="bg-[#0D0F12] px-2 py-1 rounded border border-[#232933]">
                          <span className="text-slate-500 block">FIT</span>
                          <span className="font-bold text-slate-300">{cand.breakdown.proficiencyScore}%</span>
                        </div>
                        <div className="bg-[#0D0F12] px-2 py-1 rounded border border-[#232933]">
                          <span className="text-slate-500 block">HRS</span>
                          <span className="font-bold text-slate-300">{cand.student.availabilityHoursPerWeek}h</span>
                        </div>
                      </div>

                      {/* Overall Match Circle */}
                      <div className="text-center px-2">
                        <span className={`text-xl font-bold font-mono ${
                          cand.breakdown.totalScore >= 80
                            ? 'text-emerald-400'
                            : cand.breakdown.totalScore >= 60
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}>
                          {cand.breakdown.totalScore}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">MATCH</span>
                      </div>

                      {/* Action */}
                      <div>
                        {isAssigned ? (
                          <button
                            onClick={() => {
                              if (currentRole) removeStudentFromRole(currentProject.id, currentRole.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-medium flex items-center space-x-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Unassign</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (currentRole) recruitStudentToRole(currentProject.id, currentRole.id, cand.student.id);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium shadow-md shadow-amber-600/20 flex items-center space-x-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Recruit</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Match Roles to Student Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3">Select Student Profile</h3>
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {students.map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => setInspectedStudentId(stu.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    stu.id === inspectedStudentId
                      ? 'bg-amber-500/20 border-amber-500/80 text-white'
                      : 'bg-[#0D0F12] border-[#232933] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <img src={stu.avatar} alt={stu.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="flex-1 truncate">
                    <p className="font-bold text-xs text-white truncate">{stu.name}</p>
                    <p className="text-[11px] text-slate-400">{stu.major}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white">
              Open Roles Recommended for: {inspectedStudent.name}
            </h3>

            <div className="space-y-3">
              {matchingRolesForStudent.map((match) => (
                <div
                  key={match.role.id}
                  className="bg-[#14171D] border border-[#232933] rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {match.project.title}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1">{match.role.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {match.breakdown.matchingSkills.map((s) => (
                        <span key={s} className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`text-lg font-bold font-mono ${
                        match.breakdown.totalScore >= 75 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {match.breakdown.totalScore}%
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">MATCH</span>
                    </div>

                    <button
                      onClick={() => {
                        recruitStudentToRole(match.project.id, match.role.id, inspectedStudent.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium"
                    >
                      Recruit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
