import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { rankCandidatesForRole, findMatchingRolesForStudent } from '../../engine/matching';
import { Avatar, Pips } from '../ui';

export const SkillMatchingStudio: React.FC = () => {
  const { projects, students, selectedProjectId, selectedRoleId, selectedStudentId, setSelectedProjectId, setSelectedRoleId, setSelectedStudentId, recruitStudentToRole, removeStudentFromRole } = useProjectForgeStore();
  const [mode, setMode] = useState<'byRole' | 'byStudent'>(selectedStudentId ? 'byStudent' : 'byRole');

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const role = project?.openRoles.find((r) => r.id === selectedRoleId) || project?.openRoles[0];
  const ranked = role ? rankCandidatesForRole(students, role, project) : [];
  const player = students.find((s) => s.id === selectedStudentId) || students[0];
  const fits = findMatchingRolesForStudent(player, projects);
  const lvl = (sid: string, skill: string) => students.find((s) => s.id === sid)?.skills.find((k) => k.skill === skill)?.level ?? 0;

  return (
    <div>
      <div className="flex rounded-full bg-royal-ink p-1 w-fit mb-8" role="tablist">
        {([['byRole', 'Fill a role'], ['byStudent', 'Place a player']] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`px-4 py-1.5 rounded-full font-bold ${mode === k ? 'bg-white text-royal-ink' : 'text-mist'}`}>{l}</button>
        ))}
      </div>

      {mode === 'byRole' ? (
        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8 items-start">
          <aside className="space-y-4 lg:sticky lg:top-24">
            <label className="block"><span className="lbl">Team</span>
              <select className="inp mt-1" value={project?.id} onChange={(e) => { const p = projects.find((x) => x.id === e.target.value); setSelectedProjectId(e.target.value); if (p?.openRoles[0]) setSelectedRoleId(p.openRoles[0].id); }}>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </label>
            <div>
              <span className="lbl">Roles on this team</span>
              <div className="mt-1 space-y-1.5">
                {project?.openRoles.map((r) => {
                  const on = r.id === role?.id;
                  const holder = students.find((s) => s.id === r.filledByStudentId);
                  return (
                    <button key={r.id} onClick={() => setSelectedRoleId(r.id)} aria-pressed={on}
                      className={`w-full text-left rounded-xl px-3 py-2.5 border-2 ${on ? 'bg-volt text-royal-ink border-volt' : 'border-royal-line hover:border-white/60'}`}>
                      <span className="font-bold block">{r.title}</span>
                      <span className={`text-[13px] ${on ? 'text-royal-ink/70' : 'text-mist'}`}>{holder ? `Filled by ${holder.name}` : 'Open seat'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-[13px] text-mist leading-relaxed">Score = 50% skill coverage + 35% proficiency against the minimum level + 15% weekly hours available.</p>
          </aside>

          <section>
            {role && (
              <div className="mb-6">
                <div className="lbl !text-volt">On the clock</div>
                <h1 className="disp font-black text-[30px] md:text-[44px] leading-[1.02] mt-1">{role.title}</h1>
                <p className="text-mist mt-1">for {project.title}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {role.requiredSkills.map((r) => (
                    <span key={r.skill} className="flex items-center gap-2 bg-royal-ink rounded-full pl-3 pr-2 py-1 text-[14px]">
                      <span className="font-semibold">{r.skill}</span><Pips level={r.minLevel} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ol className="space-y-3">
              {ranked.map((c, i) => {
                const held = role?.filledByStudentId === c.student.id;
                return (
                  <li key={c.student.id} className={`card grid grid-cols-[auto_1fr] md:grid-cols-[56px_auto_1fr_auto_auto] items-center gap-x-4 gap-y-3 p-4 ${held ? 'ring-4 ring-hit' : i === 0 ? 'ring-4 ring-volt' : ''}`}>
                    <span className={`disp font-black text-[34px] leading-none row-span-2 md:row-span-1 ${i === 0 ? 'text-royal' : 'text-card-ink/25'}`}>{i + 1}</span>
                    <span className="flex items-center gap-3 min-w-0">
                      <Avatar s={c.student} size={48} />
                      <span className="min-w-0">
                        <span className="font-extrabold text-[17px] block truncate">{c.student.name}</span>
                        <span className="text-[13px] text-card-ink/60">{c.student.year} · {c.student.availabilityHoursPerWeek} h/week</span>
                      </span>
                    </span>
                    <span className="col-span-2 md:col-span-1 grid grid-cols-[minmax(0,auto)_auto] gap-x-3 gap-y-1 text-[13px] content-center">
                      {role?.requiredSkills.map((r) => (
                        <React.Fragment key={r.skill}>
                          <span className={`truncate ${lvl(c.student.id, r.skill) ? '' : 'text-card-ink/40 line-through'}`}>{r.skill}</span>
                          <Pips level={lvl(c.student.id, r.skill)} need={r.minLevel} dark />
                        </React.Fragment>
                      ))}
                    </span>
                    <span className="text-right">
                      <span className="disp font-black text-[34px] leading-none" style={{ color: c.breakdown.totalScore >= 80 ? '#0f9d63' : c.breakdown.totalScore >= 60 ? '#a87b00' : '#d63451' }}>{c.breakdown.totalScore}</span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-card-ink/50">match</span>
                    </span>
                    <span className="col-span-2 md:col-span-1 flex md:block justify-end">
                      {held
                        ? <button className="gbtn gbtn-dark !py-1.5" onClick={() => role && removeStudentFromRole(project.id, role.id)}>Release</button>
                        : <button className="vbtn !bg-royal !text-white !py-1.5" onClick={() => role && recruitStudentToRole(project.id, role.id, c.student.id)}>Draft</button>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8 items-start">
          <aside className="space-y-1.5">
            <span className="lbl">Players</span>
            {students.map((s) => {
              const on = s.id === player.id;
              return (
                <button key={s.id} onClick={() => setSelectedStudentId(s.id)} aria-pressed={on}
                  className={`w-full flex items-center gap-3 text-left rounded-xl px-3 py-2 ${on ? 'bg-volt text-royal-ink' : 'hover:bg-white/10'}`}>
                  <Avatar s={s} size={34} />
                  <span className="min-w-0"><span className="font-bold block truncate">{s.name}</span><span className={`text-[12.5px] ${on ? 'text-royal-ink/70' : 'text-mist'}`}>{s.skills.slice(0, 2).map((k) => k.skill).join(', ')}</span></span>
                </button>
              );
            })}
          </aside>
          <section>
            <div className="flex items-center gap-4 mb-6">
              <Avatar s={player} size={72} ring />
              <div>
                <h1 className="disp font-black text-[28px] md:text-[38px] leading-none">{player.name}</h1>
                <p className="text-mist mt-1">{player.bio}</p>
              </div>
            </div>
            {fits.length === 0 && <p className="text-mist py-10">No open roles anywhere right now.</p>}
            <div className="grid md:grid-cols-2 gap-3">
              {fits.map((m) => (
                <div key={m.role.id} className="card p-4 flex gap-4 items-center">
                  <span className="flex-1 min-w-0">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-royal block truncate">{m.project.title}</span>
                    <span className="font-extrabold text-[17px] block">{m.role.title}</span>
                    <span className="text-[13px] text-card-ink/60">{m.breakdown.matchingSkills.length ? `has ${m.breakdown.matchingSkills.join(', ')}` : 'no overlapping skills'}{m.breakdown.missingSkills.length ? ` · lacks ${m.breakdown.missingSkills.join(', ')}` : ''}</span>
                  </span>
                  <span className="text-center">
                    <span className="disp font-black text-[28px] leading-none block">{m.breakdown.totalScore}</span>
                    <button className="vbtn !bg-royal !text-white !py-1 !px-3 text-[13px] mt-2" onClick={() => recruitStudentToRole(m.project.id, m.role.id, player.id)}>Draft</button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
