import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { Avatar, Head, Pips } from '../ui';
import { Search } from 'lucide-react';

export const StudentProfilesView: React.FC = () => {
  const { students, projects, setSelectedStudentId, setActiveTab } = useProjectForgeStore();
  const [q, setQ] = useState('');
  const list = students.filter((s) => {
    const t = q.toLowerCase();
    return !t || [s.name, s.handle, s.major, ...s.skills.map((k) => k.skill)].some((x) => x.toLowerCase().includes(t));
  });
  const teamOf = (id: string) => projects.filter((p) => p.members.includes(id)).map((p) => p.title);

  return (
    <div>
      <Head title="The roster" sub="Every student engineer on campus who opted in. Search by skill to scout."
        right={<label className="relative block w-full md:w-80"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" /><input className="inp !pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rust, ROS, PyTorch…" /></label>} />
      {list.length === 0 && <p className="text-mist py-16 text-center text-[17px]">Nobody with “{q}” yet.</p>}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((s) => {
          const teams = teamOf(s.id);
          return (
            <article key={s.id} className="card overflow-hidden flex flex-col">
              <div className="bg-royal-ink text-white px-5 pt-5 pb-4 flex items-center gap-4">
                <Avatar s={s} size={64} ring />
                <div className="min-w-0">
                  <h2 className="disp font-bold text-[19px] leading-tight">{s.name}</h2>
                  <p className="text-mist text-[13px]">{s.year} · {s.major}</p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[14px] text-card-ink/75">{s.bio}</p>
                <dl className="mt-4 space-y-1.5">
                  {s.skills.map((k) => (
                    <div key={k.skill} className="flex justify-between items-center text-[14px]"><dt className="font-semibold">{k.skill}</dt><dd><Pips level={k.level} dark /></dd></div>
                  ))}
                </dl>
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t-2 border-royal/10 text-center">
                  <div><div className="disp font-bold text-[18px]">{s.githubStats.commits}</div><div className="text-[11.5px] text-card-ink/55">commits</div></div>
                  <div><div className="disp font-bold text-[18px]">{s.githubStats.prs}</div><div className="text-[11.5px] text-card-ink/55">PRs</div></div>
                  <div><div className="disp font-bold text-[18px]">{s.availabilityHoursPerWeek}</div><div className="text-[11.5px] text-card-ink/55">h/week</div></div>
                </div>
                <p className="text-[12.5px] text-card-ink/55 mt-3">{teams.length ? `Plays for ${teams.join(', ')}` : 'Free agent'}</p>
                <button className="vbtn !bg-royal !text-white mt-4" onClick={() => { setSelectedStudentId(s.id); setActiveTab('matching'); }}>Find a team for {s.name.split(' ')[0]}</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
