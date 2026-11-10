import { describe, it, expect } from 'vitest';
import { computeMatchScore, rankCandidatesForRole, findMatchingRolesForStudent } from './matching';
import { StudentProfile, ProjectRole, Project } from '../types';

describe('ProjectForge Skill Matching Algorithm', () => {
  const dummyStudentHigh: StudentProfile = {
    id: 'stu-test-1',
    name: 'Alice Turing',
    handle: 'alice',
    avatar: '',
    year: 'Senior',
    major: 'CS',
    bio: 'Rust systems developer',
    skills: [
      { skill: 'Rust', level: 5 },
      { skill: 'Linux Kernel', level: 4 },
      { skill: 'C/C++', level: 5 },
    ],
    rolePreferences: ['Systems Lead'],
    availabilityHoursPerWeek: 18,
    githubStats: { commits: 500, prs: 50, stars: 100 },
    contributionActivity: Array(52).fill(5),
  };

  const dummyStudentLow: StudentProfile = {
    id: 'stu-test-2',
    name: 'Bob Novice',
    handle: 'bob',
    avatar: '',
    year: 'Freshman',
    major: 'Math',
    bio: 'Beginner programmer',
    skills: [
      { skill: 'Python', level: 2 },
    ],
    rolePreferences: ['Intern'],
    availabilityHoursPerWeek: 8,
    githubStats: { commits: 20, prs: 2, stars: 5 },
    contributionActivity: Array(52).fill(1),
  };

  const dummyRole: ProjectRole = {
    id: 'role-test-1',
    title: 'Rust Kernel Subsystem Lead',
    requiredSkills: [
      { skill: 'Rust', minLevel: 4 },
      { skill: 'Linux Kernel', minLevel: 3 },
    ],
    filledByStudentId: null,
    status: 'open',
  };

  const dummyProject: Project = {
    id: 'proj-test',
    title: 'TestOS',
    tagline: 'Test OS',
    description: 'Test OS description',
    domain: 'Systems & Compilers',
    status: 'recruiting',
    leadStudentId: 'stu-test-1',
    openRoles: [dummyRole],
    members: ['stu-test-1'],
    repoUrl: 'https://github.com/test/test-os',
    starsCount: 10,
    forksCount: 2,
    createdAt: '2026-01-01',
  };

  it('computes high match score when student possesses all required skills with surplus proficiency', () => {
    const score = computeMatchScore(dummyStudentHigh, dummyRole);
    expect(score.coverageScore).toBe(100);
    expect(score.proficiencyScore).toBe(100);
    expect(score.totalScore).toBeGreaterThanOrEqual(90);
    expect(score.matchingSkills).toContain('Rust');
    expect(score.matchingSkills).toContain('Linux Kernel');
    expect(score.missingSkills.length).toBe(0);
  });

  it('computes low match score when student lacks required skills', () => {
    const score = computeMatchScore(dummyStudentLow, dummyRole);
    expect(score.coverageScore).toBe(0);
    expect(score.proficiencyScore).toBe(0);
    expect(score.totalScore).toBeLessThan(30);
    expect(score.missingSkills).toContain('Rust');
    expect(score.missingSkills).toContain('Linux Kernel');
  });

  it('ranks multiple candidates accurately with highest match at index 0', () => {
    const ranked = rankCandidatesForRole([dummyStudentLow, dummyStudentHigh], dummyRole, dummyProject);
    expect(ranked.length).toBe(2);
    expect(ranked[0].student.id).toBe(dummyStudentHigh.id);
    expect(ranked[0].breakdown.totalScore).toBeGreaterThan(ranked[1].breakdown.totalScore);
  });

  it('finds matching open roles for student across project portfolio', () => {
    const roles = findMatchingRolesForStudent(dummyStudentHigh, [dummyProject]);
    expect(roles.length).toBe(1);
    expect(roles[0].role.id).toBe(dummyRole.id);
    expect(roles[0].breakdown.totalScore).toBeGreaterThanOrEqual(90);
  });
});
