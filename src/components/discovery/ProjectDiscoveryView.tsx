import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { ProjectDomain } from '../../types';
import { Avatar, Head } from '../ui';
import { GitFork, Plus, Star, X } from 'lucide-react';

const DOMAINS: (ProjectDomain | 'all')[] = ['all', 'Systems & Compilers', 'AI/ML', 'Robotics & IoT', 'Cybersecurity', 'Distributed Systems'];
const STATUS: Record<string, string> = { recruiting: 'Recruiting', in_development: 'Building', review: 'In review', launched: 'Shipped' };

export const ProjectDiscoveryView: React.FC = () => {
  const { projects, students, filterDomain, setFilterDomain, setSelectedProjectId, setSelectedRoleId, setActiveTab, createProject } = useProjectForgeStore();
  const [proposing, setProposing] = useState(false);
  const [f, setF] = useState({ title: '', tagline: '', domain: 'Systems & Compilers' as ProjectDomain, role: '', skills: 'Rust:4, Linux Kernel:3' });
  const list = projects.filter((p) => filterDomain === 'all' || p.domain === filterDomain);

  const draft = (pid: string, rid?: string) => { setSelectedProjectId(pid); if (rid) setSelectedRoleId(rid); setActiveTab('matching'); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.tagline.trim()) return;
    const req = f.skills.split(',').map((it) => { const [skill, lvl] = it.split(':').map((s) => s.trim()); return { skill: skill || 'General', minLevel: Math.min(5, Math.max(1, parseInt(lvl, 10) || 3)) }; });
    createProject({
      title: f.title.trim(), tagline: f.tagline.trim(), description: f.tagline.trim(), domain: f.domain, status: 'recruiting',
      leadStudentId: students[0]?.id || 'stu-1', members: [students[0]?.id || 'stu-1'],
      repoUrl: `https://github.com/campus-labs/${f.title.toLowerCase().replace(/\s+/g, '-')}`,
      openRoles: [{ id: `role-${Date.now()}`, title: f.role.trim() || 'Core engineer', requiredSkills: req, filledByStudentId: null, status: 'open' }],
    });
    setProposing(false);
    setF({ ...f, title: '', tagline: '', role: '' });
  };

  return (
    <div>
      <Head title={<>Pick a team.<br /><span className="text-volt">Fill the empty seats.</span></>}
        sub="Student-led projects looking for people. Every dashed circle is an open role. Tap it to see who fits best."
        right={<button className="vbtn" onClick={() => setProposing(!proposing)}>{proposing ? <><X size={16} /> Close</> : <><Plus size={16} /> Start a team</>}</button>} />

      {proposing && (
        <form onSubmit={submit} className="panel p-5 md:p-6 mb-8 grid md:grid-cols-2 gap-4">
          <label className="block"><span className="lbl">Project name</span><input className="inp mt-1" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="HyperLogLog engine in Rust" required /></label>
          <label className="block"><span className="lbl">One-line pitch</span><input className="inp mt-1" value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} placeholder="Cardinality estimates for streaming logs" required /></label>
          <label className="block"><span className="lbl">Domain</span>
            <select className="inp mt-1" value={f.domain} onChange={(e) => setF({ ...f, domain: e.target.value as ProjectDomain })}>{DOMAINS.slice(1).map((d) => <option key={d}>{d}</option>)}</select>
          </label>
          <label className="block"><span className="lbl">First open role</span><input className="inp mt-1" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} placeholder="SIMD Rust developer" /></label>
          <label className="block md:col-span-2"><span className="lbl">Skills it needs · skill:level, comma separated</span><input className="inp mt-1" value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} /></label>
          <div className="md:col-span-2 flex justify-end"><button className="vbtn">Publish team</button></div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {DOMAINS.map((d) => (
          <button key={d} onClick={() => setFilterDomain(d)} aria-pressed={filterDomain === d}
            className={`px-4 py-1.5 rounded-full font-semibold whitespace-nowrap border-2 ${filterDomain === d ? 'bg-white text-royal-ink border-white' : 'border-white/25 text-mist hover:border-white/60'}`}>
            {d === 'all' ? 'Everything' : d}
          </button>
        ))}
      </div>

      {list.length === 0 && <p className="text-mist py-16 text-center text-[17px]">No teams in this domain yet. Start one.</p>}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((p) => {
          const open = p.openRoles.filter((r) => r.status === 'open');
          return (
            <article key={p.id} className="card p-5 flex flex-col">
              <div className="flex justify-between items-center text-[12px] font-bold uppercase tracking-wider">
                <span className="text-royal">{p.domain}</span>
                <span className={`px-2 py-0.5 rounded-full ${p.status === 'recruiting' ? 'bg-volt' : 'bg-royal/10'}`}>{STATUS[p.status]}</span>
              </div>
              <h2 className="disp font-bold text-[21px] leading-tight mt-3">{p.title}</h2>
              <p className="text-[14.5px] text-card-ink/70 mt-1.5 flex-1">{p.tagline}</p>

              <div className="mt-5">
                <div className="text-[12px] font-bold uppercase tracking-wider text-card-ink/60 mb-2">Lineup · {p.members.length} in, {open.length} open</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {p.members.map((id) => { const s = students.find((x) => x.id === id); return <span key={id} title={s?.name}><Avatar s={s} size={38} /></span>; })}
                  {open.map((r) => (
                    <button key={r.id} onClick={() => draft(p.id, r.id)} title={`Open: ${r.title}`}
                      className="w-[38px] h-[38px] rounded-full border-2 border-dashed border-royal text-royal grid place-items-center hover:bg-volt hover:border-solid hover:border-royal-ink transition-colors">
                      <Plus size={16} />
                    </button>
                  ))}
                </div>
                {open.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {open.map((r) => (
                      <li key={r.id} className="text-[13.5px] flex justify-between gap-2">
                        <span className="font-semibold">{r.title}</span>
                        <span className="text-card-ink/60 truncate">{r.requiredSkills.map((s) => s.skill).join(' · ')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t-2 border-royal/10">
                <span className="flex gap-3 text-[13px] text-card-ink/60">
                  <span className="flex items-center gap-1"><Star size={14} />{p.starsCount}</span>
                  <span className="flex items-center gap-1"><GitFork size={14} />{p.forksCount}</span>
                </span>
                <span className="flex gap-2">
                  <button className="gbtn gbtn-dark !py-1.5 !px-3 text-[14px]" onClick={() => { setSelectedProjectId(p.id); setActiveTab('kanban'); }}>Board</button>
                  {open.length > 0 && <button className="vbtn !py-1.5 !px-3 text-[14px] !bg-royal !text-white" onClick={() => draft(p.id, open[0].id)}>Draft</button>}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
