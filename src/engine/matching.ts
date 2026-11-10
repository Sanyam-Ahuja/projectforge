import { 
  StudentProfile, 
  ProjectRole, 
  Project, 
  MatchScoreBreakdown, 
  StudentRoleMatch 
} from '../types';

/**
 * Computes an explainable multi-factor skill compatibility score
 * between a candidate student profile and an engineering project role.
 */
export function computeMatchScore(
  student: StudentProfile,
  role: ProjectRole
): MatchScoreBreakdown {
  if (role.requiredSkills.length === 0) {
    return {
      coverageScore: 100,
      proficiencyScore: 100,
      availabilityScore: Math.min(100, Math.round((student.availabilityHoursPerWeek / 15) * 100)),
      totalScore: 100,
      matchingSkills: [],
      missingSkills: [],
    };
  }

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  let proficiencySum = 0;

  for (const req of role.requiredSkills) {
    const studentSkill = student.skills.find(
      (s) => s.skill.toLowerCase() === req.skill.toLowerCase()
    );

    if (studentSkill) {
      matchingSkills.push(req.skill);
      const ratio = Math.min(1.0, studentSkill.level / req.minLevel);
      proficiencySum += ratio;
    } else {
      missingSkills.push(req.skill);
    }
  }

  const coverageScore = Math.round(
    (matchingSkills.length / role.requiredSkills.length) * 100
  );

  const proficiencyScore = matchingSkills.length > 0
    ? Math.round((proficiencySum / role.requiredSkills.length) * 100)
    : 0;

  // Assume 15 hours/week is target engineering availability
  const availabilityScore = Math.min(
    100,
    Math.round((student.availabilityHoursPerWeek / 15) * 100)
  );

  // Weighted composition: Coverage (50%), Proficiency (35%), Availability (15%)
  const totalScore = Math.round(
    coverageScore * 0.50 + proficiencyScore * 0.35 + availabilityScore * 0.15
  );

  return {
    coverageScore,
    proficiencyScore,
    availabilityScore,
    totalScore: Math.min(100, Math.max(0, totalScore)),
    matchingSkills,
    missingSkills,
  };
}

/**
 * Ranks all available students for a given project role
 */
export function rankCandidatesForRole(
  students: StudentProfile[],
  role: ProjectRole,
  project: Project
): StudentRoleMatch[] {
  const matches: StudentRoleMatch[] = students.map((student) => ({
    student,
    role,
    project,
    breakdown: computeMatchScore(student, role),
  }));

  // Sort descending by totalScore, then commits
  return matches.sort((a, b) => {
    if (b.breakdown.totalScore !== a.breakdown.totalScore) {
      return b.breakdown.totalScore - a.breakdown.totalScore;
    }
    return b.student.githubStats.commits - a.student.githubStats.commits;
  });
}

/**
 * Finds all open roles matching a student profile across all active projects
 */
export function findMatchingRolesForStudent(
  student: StudentProfile,
  projects: Project[]
): StudentRoleMatch[] {
  const matches: StudentRoleMatch[] = [];

  for (const project of projects) {
    for (const role of project.openRoles) {
      if (role.status === 'open') {
        matches.push({
          student,
          role,
          project,
          breakdown: computeMatchScore(student, role),
        });
      }
    }
  }

  return matches.sort((a, b) => b.breakdown.totalScore - a.breakdown.totalScore);
}
