import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { ProjectDomain, ProjectStatus } from '../../types';
import { 
  Plus, 
  Star, 
  GitFork, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Flame,
  Kanban,
  Target
} from 'lucide-react';

const DOMAINS: (ProjectDomain | 'all')[] = [
  'all',
  'Systems & Compilers',
  'AI/ML',
  'Robotics & IoT',
  'Cybersecurity',
  'Distributed Systems',
];

export const ProjectDiscoveryView: React.FC = () => {
  const { 
    projects, 
    students, 
    filterDomain, 
    setFilterDomain, 
    setSelectedProjectId, 
    setActiveTab,
    createProject 
  } = useProjectForgeStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDomain, setNewDomain] = useState<ProjectDomain>('Systems & Compilers');
  const [newRepo, setNewRepo] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleSkills, setNewRoleSkills] = useState('Rust:4, Linux Kernel:3');

  const filteredProjects = projects.filter((p) => {
    if (filterDomain === 'all') return true;
    return p.domain === filterDomain;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTagline) return;

    // Parse skills format: "Skill:Level, Skill2:Level"
    const reqSkills = newRoleSkills.split(',').map((item) => {
      const [skill, levelStr] = item.split(':').map((s) => s.trim());
      return {
        skill: skill || 'General',
        minLevel: levelStr ? parseInt(levelStr, 10) : 3,
      };
    });

    createProject({
      title: newTitle.trim(),
      tagline: newTagline.trim(),
      description: newDesc.trim() || newTagline.trim(),
      domain: newDomain,
      status: 'recruiting',
      leadStudentId: students[0]?.id || 'stu-1',
      members: [students[0]?.id || 'stu-1'],
      repoUrl: newRepo.trim() || `https://github.com/campus-labs/${newTitle.toLowerCase().replace(/\s+/g, '-')}`,
      openRoles: [
        {
          id: `role-${Date.now()}`,
          title: newRoleTitle.trim() || 'Core Engineer',
          requiredSkills: reqSkills,
          filledByStudentId: null,
          status: 'open',
        },
      ],
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewTagline('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase">
                Active Incubator
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {projects.length} Technical Initiatives
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Campus Engineering Project Hub</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Discover student-led open source systems, robotics payloads, edge ML models, and security tooling. Recruit candidates through multi-objective skill alignment.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium text-xs shadow-lg shadow-amber-600/20 flex items-center space-x-1.5 self-start md:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Propose Initiative</span>
          </button>
        </div>
      </div>

      {/* Domain Filter Bar */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
        {DOMAINS.map((domain) => (
          <button
            key={domain}
            onClick={() => setFilterDomain(domain)}
            className={`px-3.5 py-1.5 rounded-xl capitalize font-medium whitespace-nowrap transition-all ${
              filterDomain === domain
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-[#14171D] text-slate-400 border border-[#232933] hover:text-white hover:border-slate-700'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const leadStudent = students.find((s) => s.id === project.leadStudentId);
          const openRoles = project.openRoles.filter((r) => r.status === 'open');

          return (
            <div
              key={project.id}
              className="bg-[#14171D] border border-[#232933] rounded-2xl p-5 hover:border-[#374151] transition-all flex flex-col justify-between shadow-lg group"
            >
              <div>
                {/* Domain & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 uppercase font-semibold">
                    {project.domain}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold border ${
                    project.status === 'recruiting'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : project.status === 'in_development'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-base font-bold text-white mt-3 group-hover:text-amber-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2">
                  {project.tagline}
                </p>

                {/* Open Roles Badges */}
                <div className="mt-4 pt-3 border-t border-[#232933]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500 font-mono text-[11px]">OPEN ROLES</span>
                    <span className="font-mono text-amber-400 font-bold text-[11px]">
                      {openRoles.length} opening{openRoles.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {project.openRoles.map((role) => (
                      <div
                        key={role.id}
                        className={`text-[11px] p-2 rounded-lg border flex items-center justify-between ${
                          role.status === 'open'
                            ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                        }`}
                      >
                        <span className="font-medium truncate mr-2">{role.title}</span>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {role.status === 'open' ? (
                            role.requiredSkills.slice(0, 2).map((req) => (
                              <span key={req.skill} className="text-[9px] px-1 rounded bg-black/40 text-amber-300 font-mono">
                                {req.skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-mono">FILLED</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Members & Stats */}
                <div className="mt-4 pt-3 border-t border-[#232933] flex items-center justify-between text-xs">
                  <div className="flex items-center -space-x-2">
                    {project.members.slice(0, 4).map((memberId) => {
                      const m = students.find((s) => s.id === memberId);
                      return (
                        <img
                          key={memberId}
                          src={m?.avatar}
                          alt={m?.name}
                          title={m?.name}
                          className="w-6 h-6 rounded-full border border-slate-800 object-cover"
                        />
                      );
                    })}
                    {project.members.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-slate-400 font-mono">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{project.starsCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{project.forksCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#232933] grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('matching');
                  }}
                  className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center space-x-1 transition-all"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Match Devs</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('kanban');
                  }}
                  className="py-1.5 px-2 rounded-lg bg-[#1E232B] hover:bg-slate-800 text-slate-200 border border-[#2D3540] text-xs font-medium flex items-center justify-center space-x-1 transition-all"
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Workspace</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Propose Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14171D] border border-[#2D3540] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Propose Engineering Initiative</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HyperLogLog Rust Engine"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardinality estimation for distributed streaming"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Engineering Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as ProjectDomain)}
                    className="w-full px-2 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none"
                  >
                    {DOMAINS.filter((d) => d !== 'all').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Open Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SIMD Rust Developer"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Required Skills (Skill:MinLevel, ...)</label>
                <input
                  type="text"
                  placeholder="Rust:4, C/C++:3, WebAssembly:3"
                  value={newRoleSkills}
                  onChange={(e) => setNewRoleSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-600/30"
                >
                  Publish Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
