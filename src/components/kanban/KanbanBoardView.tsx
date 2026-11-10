import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { KanbanTask, TaskPriority, TaskStatus } from '../../types';
import { Avatar, Head } from '../ui';
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';

const COLS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'Up next' },
  { id: 'in_progress', label: 'Playing' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Scored' },
];
const PRI: Record<TaskPriority, string> = { urgent: 'bg-miss text-white', high: 'bg-volt text-royal-ink', medium: 'bg-royal/10 text-royal', low: 'bg-card-ink/5 text-card-ink/60' };

export const KanbanBoardView: React.FC = () => {
  const { kanbanTasks, projects, students, selectedProjectId, moveKanbanTask, deleteKanbanTask, addKanbanTask } = useProjectForgeStore();
  const [pid, setPid] = useState<string>(selectedProjectId || 'all');
  const [adding, setAdding] = useState(false);
  const [t, setT] = useState({ title: '', desc: '', priority: 'medium' as TaskPriority, points: 3, assignee: '', tags: 'Frontend' });
  const tasks = kanbanTasks.filter((k) => pid === 'all' || k.projectId === pid);
  const pts = (s: TaskStatus) => tasks.filter((k) => k.status === s).reduce((a, k) => a + k.storyPoints, 0);
  const total = tasks.reduce((a, k) => a + k.storyPoints, 0) || 1;

  const move = (k: KanbanTask, d: number) => { const i = COLS.findIndex((c) => c.id === k.status) + d; if (i >= 0 && i < COLS.length) moveKanbanTask(k.id, COLS[i].id); };
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!t.title.trim()) return;
    const tags = t.tags.split(',').map((x) => x.trim()).filter(Boolean);
    addKanbanTask({ projectId: pid === 'all' ? selectedProjectId : pid, title: t.title.trim(), description: t.desc.trim(), priority: t.priority, assigneeId: t.assignee || null, tags: tags.length ? tags : ['General'], storyPoints: Number(t.points) });
    setAdding(false); setT({ ...t, title: '', desc: '' });
  };

  return (
    <div>
      <Head title="The board" sub="Move work left to right. Points on the scoreboard are story points done."
        right={
          <div className="flex flex-wrap gap-2">
            <select className="inp !w-auto" value={pid} onChange={(e) => setPid(e.target.value)} aria-label="Team">
              <option value="all">Every team</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <button className="vbtn" onClick={() => setAdding(!adding)}>{adding ? <><X size={16} /> Close</> : <><Plus size={16} /> Task</>}</button>
          </div>
        } />

      {/* scoreboard: share of points in each column */}
      <div className="flex h-3 rounded-full overflow-hidden mb-8 bg-royal-ink" aria-label="points by column">
        {COLS.map((c, i) => <span key={c.id} style={{ width: `${(pts(c.id) / total) * 100}%`, background: ['#3550d6', '#7d8ff0', '#ffd60a', '#ff9f43', '#2ee59d'][i] }} title={`${c.label}: ${pts(c.id)} pts`} />)}
      </div>

      {adding && (
        <form onSubmit={add} className="panel p-5 mb-8 grid md:grid-cols-6 gap-3">
          <label className="md:col-span-3"><span className="lbl">Task</span><input className="inp mt-1" value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} placeholder="Parse CAN bus telemetry packets" required /></label>
          <label className="md:col-span-3"><span className="lbl">Owner</span>
            <select className="inp mt-1" value={t.assignee} onChange={(e) => setT({ ...t, assignee: e.target.value })}><option value="">Nobody yet</option>{students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          </label>
          <label className="md:col-span-6"><span className="lbl">Details</span><input className="inp mt-1" value={t.desc} onChange={(e) => setT({ ...t, desc: e.target.value })} placeholder="Acceptance criteria" /></label>
          <label className="md:col-span-2"><span className="lbl">Priority</span>
            <select className="inp mt-1" value={t.priority} onChange={(e) => setT({ ...t, priority: e.target.value as TaskPriority })}>{(['low', 'medium', 'high', 'urgent'] as const).map((p) => <option key={p}>{p}</option>)}</select>
          </label>
          <label className="md:col-span-1"><span className="lbl">Points</span><input type="number" min={1} max={13} className="inp mt-1" value={t.points} onChange={(e) => setT({ ...t, points: Number(e.target.value) })} /></label>
          <label className="md:col-span-2"><span className="lbl">Tags</span><input className="inp mt-1" value={t.tags} onChange={(e) => setT({ ...t, tags: e.target.value })} /></label>
          <div className="md:col-span-1 flex items-end"><button className="vbtn w-full">Add</button></div>
        </form>
      )}

      <div className="grid grid-flow-col auto-cols-[minmax(232px,1fr)] gap-4 overflow-x-auto pb-4">
        {COLS.map((c, ci) => {
          const col = tasks.filter((k) => k.status === c.id);
          return (
            <section key={c.id} className="panel p-3 min-h-[320px]">
              <header className="flex justify-between items-baseline px-1 pb-3">
                <h2 className="disp font-bold text-[16px]">{c.label}</h2>
                <span className="text-[13px] text-mist">{col.length} · {pts(c.id)} pts</span>
              </header>
              <div className="space-y-2.5">
                {col.length === 0 && <p className="text-[13px] text-mist/70 px-1 py-6 text-center border-2 border-dashed border-royal-line rounded-xl">Empty</p>}
                {col.map((k) => {
                  const who = students.find((s) => s.id === k.assigneeId);
                  const proj = projects.find((p) => p.id === k.projectId);
                  return (
                    <article key={k.id} className="card p-3 group">
                      <div className="flex justify-between gap-2 items-start">
                        <span className="text-[11.5px] font-bold uppercase tracking-wider text-royal truncate">{proj?.title}</span>
                        <span className={`text-[11px] font-bold uppercase px-1.5 py-0.5 rounded ${PRI[k.priority]}`}>{k.priority}</span>
                      </div>
                      <h3 className="font-extrabold leading-snug mt-1">{k.title}</h3>
                      {k.description && <p className="text-[13px] text-card-ink/65 mt-1 line-clamp-2">{k.description}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <span className="flex items-center gap-2 text-[13px]">
                          {who ? <><Avatar s={who} size={24} />{who.name.split(' ')[0]}</> : <span className="text-card-ink/50">Unowned</span>}
                        </span>
                        <span className="disp font-bold text-[14px] text-royal">{k.storyPoints}</span>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t border-card-ink/10">
                        <span className="flex gap-1">
                          <button disabled={ci === 0} onClick={() => move(k, -1)} aria-label="Move back" className="p-1 rounded hover:bg-royal/10 disabled:opacity-25"><ChevronLeft size={16} /></button>
                          <button disabled={ci === COLS.length - 1} onClick={() => move(k, 1)} aria-label="Move forward" className="p-1 rounded hover:bg-volt disabled:opacity-25"><ChevronRight size={16} /></button>
                        </span>
                        <button onClick={() => deleteKanbanTask(k.id)} aria-label="Delete task" className="p-1 rounded text-card-ink/40 hover:text-miss"><Trash2 size={15} /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
