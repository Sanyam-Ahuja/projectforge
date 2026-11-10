import { create } from 'zustand';
import { 
  Project, 
  StudentProfile, 
  KanbanTask, 
  ProjectDomain, 
  TaskStatus, 
  TaskPriority 
} from '../types';
import { SEED_PROJECTS, SEED_STUDENTS, SEED_TASKS } from '../data/seedData';

const STORAGE_KEY = 'projectforge_state_v1';

interface ProjectForgeState {
  activeTab: 'discovery' | 'matching' | 'kanban' | 'heatmap' | 'students';
  setActiveTab: (tab: ProjectForgeState['activeTab']) => void;

  projects: Project[];
  students: StudentProfile[];
  kanbanTasks: KanbanTask[];

  selectedProjectId: string;
  selectedRoleId: string | null;
  selectedStudentId: string | null;
  filterDomain: string;

  // Actions
  setSelectedProjectId: (id: string) => void;
  setSelectedRoleId: (id: string | null) => void;
  setSelectedStudentId: (id: string | null) => void;
  setFilterDomain: (domain: string) => void;

  recruitStudentToRole: (projectId: string, roleId: string, studentId: string) => void;
  removeStudentFromRole: (projectId: string, roleId: string) => void;
  createProject: (newProj: Omit<Project, 'id' | 'starsCount' | 'forksCount' | 'createdAt'>) => void;

  addKanbanTask: (task: {
    projectId: string;
    title: string;
    description: string;
    priority: TaskPriority;
    assigneeId: string | null;
    tags: string[];
    storyPoints: number;
  }) => void;
  moveKanbanTask: (taskId: string, newStatus: TaskStatus) => void;
  deleteKanbanTask: (taskId: string) => void;

  resetDemoData: () => void;
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.projects && parsed.students && parsed.kanbanTasks) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load persisted state from localStorage', e);
  }
  return null;
}

function saveState(state: { projects: Project[]; students: StudentProfile[]; kanbanTasks: KanbanTask[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state to localStorage', e);
  }
}

const initialData = loadPersistedState() || {
  projects: SEED_PROJECTS,
  students: SEED_STUDENTS,
  kanbanTasks: SEED_TASKS,
};

export const useProjectForgeStore = create<ProjectForgeState>((set, get) => ({
  activeTab: 'discovery',
  setActiveTab: (tab) => set({ activeTab: tab }),

  projects: initialData.projects,
  students: initialData.students,
  kanbanTasks: initialData.kanbanTasks,

  selectedProjectId: initialData.projects[0]?.id || 'proj-1',
  selectedRoleId: initialData.projects[0]?.openRoles[0]?.id || null,
  selectedStudentId: null,
  filterDomain: 'all',

  setSelectedProjectId: (id) => {
    const proj = get().projects.find((p) => p.id === id);
    set({
      selectedProjectId: id,
      selectedRoleId: proj?.openRoles[0]?.id || null,
    });
  },

  setSelectedRoleId: (id) => set({ selectedRoleId: id }),
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
  setFilterDomain: (domain) => set({ filterDomain: domain }),

  recruitStudentToRole: (projectId, roleId, studentId) => {
    set((state) => {
      const updatedProjects = state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;

        const updatedRoles = proj.openRoles.map((role) => {
          if (role.id !== roleId) return role;
          return {
            ...role,
            filledByStudentId: studentId,
            status: 'filled' as const,
          };
        });

        const newMembers = proj.members.includes(studentId)
          ? proj.members
          : [...proj.members, studentId];

        return {
          ...proj,
          openRoles: updatedRoles,
          members: newMembers,
        };
      });

      saveState({
        projects: updatedProjects,
        students: state.students,
        kanbanTasks: state.kanbanTasks,
      });

      return { projects: updatedProjects };
    });
  },

  removeStudentFromRole: (projectId, roleId) => {
    set((state) => {
      const updatedProjects = state.projects.map((proj) => {
        if (proj.id !== projectId) return proj;

        const targetRole = proj.openRoles.find((r) => r.id === roleId);
        const removedStudentId = targetRole?.filledByStudentId;

        const updatedRoles = proj.openRoles.map((role) => {
          if (role.id !== roleId) return role;
          return {
            ...role,
            filledByStudentId: null,
            status: 'open' as const,
          };
        });

        // Only remove member if not filling another role or lead
        const isStillMember = updatedRoles.some((r) => r.filledByStudentId === removedStudentId) ||
          proj.leadStudentId === removedStudentId;

        const newMembers = isStillMember
          ? proj.members
          : proj.members.filter((m) => m !== removedStudentId);

        return {
          ...proj,
          openRoles: updatedRoles,
          members: newMembers,
        };
      });

      saveState({
        projects: updatedProjects,
        students: state.students,
        kanbanTasks: state.kanbanTasks,
      });

      return { projects: updatedProjects };
    });
  },

  createProject: (newProj) => {
    const project: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
      starsCount: 1,
      forksCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => {
      const projects = [project, ...state.projects];
      saveState({
        projects,
        students: state.students,
        kanbanTasks: state.kanbanTasks,
      });
      return {
        projects,
        selectedProjectId: project.id,
        activeTab: 'discovery',
      };
    });
  },

  addKanbanTask: (task) => {
    const newTask: KanbanTask = {
      ...task,
      id: `tsk-${Date.now()}`,
      status: 'todo',
      updatedAt: 'Just now',
    };

    set((state) => {
      const kanbanTasks = [newTask, ...state.kanbanTasks];
      saveState({
        projects: state.projects,
        students: state.students,
        kanbanTasks,
      });
      return { kanbanTasks };
    });
  },

  moveKanbanTask: (taskId, newStatus) => {
    set((state) => {
      const kanbanTasks = state.kanbanTasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: newStatus, updatedAt: 'Just now' };
        }
        return t;
      });

      saveState({
        projects: state.projects,
        students: state.students,
        kanbanTasks,
      });

      return { kanbanTasks };
    });
  },

  deleteKanbanTask: (taskId) => {
    set((state) => {
      const kanbanTasks = state.kanbanTasks.filter((t) => t.id !== taskId);
      saveState({
        projects: state.projects,
        students: state.students,
        kanbanTasks,
      });
      return { kanbanTasks };
    });
  },

  resetDemoData: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      projects: SEED_PROJECTS,
      students: SEED_STUDENTS,
      kanbanTasks: SEED_TASKS,
      selectedProjectId: SEED_PROJECTS[0].id,
      selectedRoleId: SEED_PROJECTS[0].openRoles[0]?.id || null,
      selectedStudentId: null,
      filterDomain: 'all',
      activeTab: 'discovery',
    });
  },
}));
