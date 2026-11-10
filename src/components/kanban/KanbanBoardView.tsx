import React, { useState } from 'react';
import { useProjectForgeStore } from '../../store/useProjectForgeStore';
import { TaskStatus, TaskPriority, KanbanTask } from '../../types';
import { 
  Kanban, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  User, 
  Tag, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'border-slate-700/60' },
  { id: 'todo', label: 'To Do', color: 'border-blue-500/40' },
  { id: 'in_progress', label: 'In Progress', color: 'border-amber-500/50' },
  { id: 'review', label: 'Code Review', color: 'border-purple-500/50' },
  { id: 'done', label: 'Completed', color: 'border-emerald-500/50' },
];

export const KanbanBoardView: React.FC = () => {
  const { 
    kanbanTasks, 
    projects, 
    students, 
    selectedProjectId, 
    setSelectedProjectId, 
    moveKanbanTask, 
    deleteKanbanTask,
    addKanbanTask 
  } = useProjectForgeStore();

  const [filterProjectId, setFilterProjectId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskPoints, setTaskPoints] = useState(3);
  const [taskAssignee, setTaskAssignee] = useState<string>('');
  const [taskTags, setTaskTags] = useState('Frontend, UI');

  const activeProject = projects.find((p) => p.id === selectedProjectId);

  const filteredTasks = kanbanTasks.filter((t) => {
    if (filterProjectId === 'all') return true;
    return t.projectId === filterProjectId;
  });

  const handleMoveTask = (task: KanbanTask, delta: number) => {
    const currentIndex = COLUMNS.findIndex((c) => c.id === task.status);
    const newIndex = currentIndex + delta;
    if (newIndex >= 0 && newIndex < COLUMNS.length) {
      moveKanbanTask(task.id, COLUMNS[newIndex].id);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const tags = taskTags.split(',').map((t) => t.trim()).filter(Boolean);

    addKanbanTask({
      projectId: filterProjectId === 'all' ? selectedProjectId : filterProjectId,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      priority: taskPriority,
      assigneeId: taskAssignee || null,
      tags: tags.length > 0 ? tags : ['General'],
      storyPoints: Number(taskPoints),
    });

    setShowAddModal(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#14171D] border border-[#232933] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase font-semibold">
              Agile Task Board
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {filteredTasks.length} Active Tasks Across Swimlanes
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Project Engineering Sprint Board</h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Track sprints, pull request reviews, and hardware prototyping across campus project teams.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Project Filter */}
          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-md shadow-amber-600/20 flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col, colIdx) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`bg-[#14171D]/90 border ${col.color} rounded-2xl p-3 flex flex-col min-h-[500px] shadow-lg`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#232933] mb-3">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  {col.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.map((task) => {
                  const proj = projects.find((p) => p.id === task.projectId);
                  const assignee = students.find((s) => s.id === task.assigneeId);

                  return (
                    <div
                      key={task.id}
                      className="bg-[#0D0F12] border border-[#232933] hover:border-slate-700 rounded-xl p-3.5 space-y-2.5 transition-all shadow-sm"
                    >
                      {/* Project Tag & Priority */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-semibold">
                          {proj?.title || 'Project'}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                          task.priority === 'urgent'
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                            : task.priority === 'high'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Story points & Assignee */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#232933]/60 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-amber-400">
                          {task.storyPoints} pts
                        </span>

                        {assignee ? (
                          <div className="flex items-center space-x-1.5">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              title={assignee.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-slate-300 font-sans truncate max-w-[80px]">
                              {assignee.name.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic font-sans">Unassigned</span>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-1 text-slate-500">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleMoveTask(task, -1)}
                            disabled={colIdx === 0}
                            className="p-1 hover:text-white disabled:opacity-20"
                            title="Move Left"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveTask(task, 1)}
                            disabled={colIdx === COLUMNS.length - 1}
                            className="p-1 hover:text-white disabled:opacity-20"
                            title="Move Right"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => deleteKanbanTask(task.id)}
                          className="p-1 hover:text-rose-400"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14171D] border border-[#2D3540] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Create Engineering Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement CAN bus telemetry packet parsing"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Technical details and acceptance criteria..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-2 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Story Points</label>
                  <input
                    type="number"
                    min={1}
                    max={13}
                    value={taskPoints}
                    onChange={(e) => setTaskPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assignee</label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full px-2 py-2 bg-[#0D0F12] border border-[#232933] rounded-xl text-white focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.year})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-600/30"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
