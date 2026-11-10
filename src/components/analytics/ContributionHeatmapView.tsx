import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { Avatar, Head } from '../ui';

const shade = (v: number) => (v <= 0 ? 'rgba(255,255,255,.08)' : v <= 3 ? 'rgba(255,214,10,.28)' : v <= 6 ? 'rgba(255,214,10,.55)' : v <= 8 ? 'rgba(255,214,10,.8)' : '#ffd60a');

export const ContributionHeatmapView: React.FC = () => {
  const { students, kanbanTasks } = useProjectForgeStore();
  const [sid, setSid] = useState(students[0]?.id);
  const s = students.find((x) => x.id === sid) || students[0];
  const sumAll = (s2: typeof s) => s2.contributionActivity.reduce((a, b) => a + b, 0);
  const table = [...students].sort((a, b) => sumAll(b) - sumAll(a));
  const done = kanbanTasks.filter((k) => k.status === 'done').length;
  const last8 = s.contributionActivity.slice(-8).reduce((a, b) => a + b, 0);
  const prev8 = s.contributionActivity.slice(-16, -8).reduce((a, b) => a + b, 0);

  return (
    <div>
      <Head title="Form guide" sub={`A year of activity per player. ${students.reduce((a, x) => a + x.githubStats.commits, 0).toLocaleString()} commits and ${students.reduce((a, x) => a + x.githubStats.prs, 0)} merged PRs across the roster; ${done} board tasks scored.`} />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8">
        <section className="panel p-5 md:p-7">
          <div className="flex items-center gap-4 mb-6">
            <Avatar s={s} size={64} ring />
            <div className="flex-1 min-w-0">
              <h2 className="disp font-black text-[26px] leading-none">{s.name}</h2>
              <p className="text-mist mt-1">@{s.handle} · {s.year} · {s.major}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-max" aria-label={`${sumAll(s)} contributions in 52 weeks`}>
              {s.contributionActivity.flatMap((w, wi) =>
                Array.from({ length: 7 }).map((_, d) => {
                  const v = w <= 0 ? 0 : Math.max(0, w - ((wi * 3 + d * 5) % 4));
                  return <span key={`${wi}-${d}`} className="w-3 h-3 rounded-[3px]" style={{ background: shade(v) }} title={`week ${wi + 1}`} />;
                }))}
            </div>
          </div>
          <div className="flex justify-between text-[12px] text-mist mt-2"><span>52 weeks ago</span><span>this week</span></div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            {[['commits', s.githubStats.commits], ['merged PRs', s.githubStats.prs], ['stars earned', s.githubStats.stars], ['hours / week', s.availabilityHoursPerWeek]].map(([k, v]) => (
              <div key={k as string}><dd className="disp font-black text-[30px] leading-none">{v}</dd><dt className="text-[13px] text-mist mt-1">{k}</dt></div>
            ))}
          </dl>
          <p className="mt-6 text-[15px]">
            Last 8 weeks: <b>{last8}</b> vs <b>{prev8}</b> the 8 before.{' '}
            <span className={last8 >= prev8 ? 'text-hit font-bold' : 'text-miss font-bold'}>{last8 >= prev8 ? 'Heating up.' : 'Cooling off.'}</span>
          </p>
        </section>

        <aside>
          <h2 className="lbl mb-2">Most active this year</h2>
          <ol className="space-y-1">
            {table.map((x, i) => (
              <li key={x.id}>
                <button onClick={() => setSid(x.id)} aria-pressed={x.id === s.id} className={`w-full grid grid-cols-[24px_auto_1fr_auto] items-center gap-3 px-3 py-2 rounded-xl text-left ${x.id === s.id ? 'bg-volt text-royal-ink' : 'hover:bg-white/10'}`}>
                  <span className="disp font-bold text-[14px]">{i + 1}</span>
                  <Avatar s={x} size={30} />
                  <span className="font-bold truncate">{x.name}</span>
                  <span className="disp font-bold text-[14px]">{sumAll(x)}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
};
