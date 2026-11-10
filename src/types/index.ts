export type ProjectDomain = 
  | 'AI/ML' 
  | 'Distributed Systems' 
  | 'Robotics & IoT' 
  | 'Cybersecurity' 
  | 'Systems & Compilers' 
  | 'Web3 / DevTools';

export type ProjectStatus = 'recruiting' | 'in_development' | 'review' | 'launched';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SkillRequirement {
  skill: string;
  minLevel: number; // 1 to 5
}

export interface StudentSkill {
  skill: string;
  level: number; // 1 to 5
}

export interface ProjectRole {
  id: string;
  title: string;
  requiredSkills: SkillRequirement[];
  filledByStudentId: string | null;
  status: 'open' | 'filled';
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  domain: ProjectDomain;
  status: ProjectStatus;
  leadStudentId: string;
  openRoles: ProjectRole[];
  members: string[]; // student IDs
  repoUrl: string;
  starsCount: number;
  forksCount: number;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
  major: string;
  bio: string;
  skills: StudentSkill[];
  rolePreferences: string[];
  availabilityHoursPerWeek: number;
  githubStats: {
    commits: number;
    prs: number;
    stars: number;
  };
  contributionActivity: number[]; // 52 weeks of activity scores
}

export interface KanbanTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  tags: string[];
  storyPoints: number;
  updatedAt: string;
}

export interface MatchScoreBreakdown {
  coverageScore: number;     // 0 to 100
  proficiencyScore: number;  // 0 to 100
  availabilityScore: number; // 0 to 100
  totalScore: number;        // 0 to 100
  matchingSkills: string[];
  missingSkills: string[];
}

export interface StudentRoleMatch {
  student: StudentProfile;
  role: ProjectRole;
  project: Project;
  breakdown: MatchScoreBreakdown;
}
