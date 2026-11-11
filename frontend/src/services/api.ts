// ============================================================
// OpportunityOS — API Service Layer
// All methods are async and read/write from localStorage-backed
// state initialized from mockDatabase.ts.
// To swap to a real backend: replace the body of each function
// with fetch(`${API_BASE}/...`) calls — no UI changes needed.
// ============================================================

import {
  domains, branches, locations, skills, organizations, students,
  opportunities, studentSkills, studentDomains, opportunitySkills,
  opportunityBranches, applications as initialApplications,
  applicationStatusHistory as initialHistory,
} from '../data/mockDatabase';

import type {
  Domain, Branch, Location, Skill, Organization, Student,
  Opportunity, StudentSkill, StudentDomain,
  Application, ApplicationStatusHistory,
  EnrichedOpportunity, EnrichedApplication,
  EligibilityResult, SkillMatchResult,
  ApplicationStatus, Proficiency, OppType, WorkMode,
} from '../types/database';

// ─── In-Memory State Store ─────────────────────────────────────
// On first load, initialize from mock data. Persisted to localStorage.

const STORAGE_KEY = 'opportunityos_db';

interface AppState {
  students: Student[];
  studentSkills: StudentSkill[];
  studentDomains: StudentDomain[];
  applications: Application[];
  history: ApplicationStatusHistory[];
  opportunities: Opportunity[];
  organizations: Organization[];
  nextApplicationId: number;
  nextHistoryId: number;
  nextOppId: number;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    students: [...students],
    studentSkills: [...studentSkills],
    studentDomains: [...studentDomains],
    applications: [...initialApplications],
    history: [...initialHistory],
    opportunities: [...opportunities],
    organizations: [...organizations],
    nextApplicationId: initialApplications.length + 1,
    nextHistoryId: initialHistory.length + 1,
    nextOppId: opportunities.length + 1,
  };
}

function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let _state: AppState = loadState();

function getState(): AppState { return _state; }
function setState(updater: (s: AppState) => AppState): void {
  _state = updater(_state);
  saveState(_state);
}

// Reset to seed data (useful for demo / testing)
export async function resetDatabase(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  _state = loadState();
}

// ─── Simulate async latency (remove for real backend) ─────────
const delay = (ms = 80) => new Promise(res => setTimeout(res, ms));

// ─── Reference Data (static, no need to persist) ──────────────

export async function getDomains(): Promise<Domain[]> {
  await delay();
  return domains;
}

export async function getBranches(): Promise<Branch[]> {
  await delay();
  return branches;
}

export async function getLocations(): Promise<Location[]> {
  await delay();
  return locations;
}

export async function getSkills(): Promise<Skill[]> {
  await delay();
  return skills;
}

export async function getOrganizations(): Promise<Organization[]> {
  await delay();
  return getState().organizations;
}

// ─── Students ─────────────────────────────────────────────────

export async function getStudents(): Promise<Student[]> {
  await delay();
  return getState().students;
}

export async function getStudentById(studentId: number): Promise<Student | null> {
  await delay();
  return getState().students.find(s => s.student_id === studentId) ?? null;
}

export async function updateStudent(studentId: number, patch: Partial<Student>): Promise<Student> {
  await delay();
  let updated: Student | null = null;
  setState(s => {
    const idx = s.students.findIndex(st => st.student_id === studentId);
    if (idx === -1) throw new Error('Student not found');
    const newStudents = [...s.students];
    newStudents[idx] = { ...newStudents[idx], ...patch };
    updated = newStudents[idx];
    return { ...s, students: newStudents };
  });
  return updated!;
}

export async function getStudentSkills(studentId: number): Promise<Array<StudentSkill & { skill: Skill }>> {
  await delay();
  const ss = getState().studentSkills.filter(s => s.student_id === studentId);
  return ss.map(s => ({ ...s, skill: skills.find(sk => sk.skill_id === s.skill_id)! }));
}

export async function addStudentSkill(studentId: number, skillId: number, proficiency: Proficiency): Promise<StudentSkill> {
  await delay();
  // Check for duplicate
  const existing = getState().studentSkills.find(s => s.student_id === studentId && s.skill_id === skillId);
  if (existing) {
    // Update proficiency
    setState(s => ({
      ...s,
      studentSkills: s.studentSkills.map(sk =>
        sk.student_id === studentId && sk.skill_id === skillId ? { ...sk, proficiency } : sk
      ),
    }));
    return { student_id: studentId, skill_id: skillId, proficiency };
  }
  const entry: StudentSkill = { student_id: studentId, skill_id: skillId, proficiency };
  setState(s => ({ ...s, studentSkills: [...s.studentSkills, entry] }));
  return entry;
}

export async function removeStudentSkill(studentId: number, skillId: number): Promise<void> {
  await delay();
  setState(s => ({
    ...s,
    studentSkills: s.studentSkills.filter(sk => !(sk.student_id === studentId && sk.skill_id === skillId)),
  }));
}

export async function getStudentDomains(studentId: number): Promise<Array<StudentDomain & { domain: Domain }>> {
  await delay();
  const sds = getState().studentDomains.filter(d => d.student_id === studentId);
  return sds.map(d => ({ ...d, domain: domains.find(dm => dm.domain_id === d.domain_id)! }));
}

export async function addStudentDomain(studentId: number, domainId: number): Promise<StudentDomain> {
  await delay();
  const existing = getState().studentDomains.find(d => d.student_id === studentId && d.domain_id === domainId);
  if (existing) return existing;
  const entry: StudentDomain = { student_id: studentId, domain_id: domainId };
  setState(s => ({ ...s, studentDomains: [...s.studentDomains, entry] }));
  return entry;
}

export async function removeStudentDomain(studentId: number, domainId: number): Promise<void> {
  await delay();
  setState(s => ({
    ...s,
    studentDomains: s.studentDomains.filter(d => !(d.student_id === studentId && d.domain_id === domainId)),
  }));
}

// ─── Opportunities ────────────────────────────────────────────

function enrichOpportunity(opp: Opportunity): EnrichedOpportunity {
  const state = getState();
  const org = state.organizations.find(o => o.org_id === opp.org_id)!;
  const domain = domains.find(d => d.domain_id === opp.domain_id)!;
  const location = opp.location_id ? locations.find(l => l.location_id === opp.location_id) ?? null : null;
  const oppSkills = opportunitySkills
    .filter(os => os.opp_id === opp.opp_id)
    .map(os => ({ ...os, skill: skills.find(sk => sk.skill_id === os.skill_id)! }));
  const oppBranches = opportunityBranches
    .filter(ob => ob.opp_id === opp.opp_id)
    .map(ob => branches.find(b => b.branch_id === ob.branch_id)!);
  return { ...opp, organization: org, domain, location, skills: oppSkills, branches: oppBranches };
}

export async function getOpportunities(filters?: {
  domainId?: number;
  oppType?: OppType;
  workMode?: WorkMode;
  locationId?: number;
  search?: string;
}): Promise<EnrichedOpportunity[]> {
  await delay();
  let opps = getState().opportunities;
  if (filters?.domainId) opps = opps.filter(o => o.domain_id === filters.domainId);
  if (filters?.oppType) opps = opps.filter(o => o.opp_type === filters.oppType);
  if (filters?.workMode) opps = opps.filter(o => o.work_mode === filters.workMode);
  if (filters?.locationId) opps = opps.filter(o => o.location_id === filters.locationId);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    opps = opps.filter(o => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
  }
  return opps.map(enrichOpportunity);
}

export async function getOpportunityById(oppId: number): Promise<EnrichedOpportunity | null> {
  await delay();
  const opp = getState().opportunities.find(o => o.opp_id === oppId);
  return opp ? enrichOpportunity(opp) : null;
}

export async function createOpportunity(data: Omit<Opportunity, 'opp_id'>): Promise<Opportunity> {
  await delay();
  let newOpp: Opportunity | null = null;
  setState(s => {
    newOpp = { ...data, opp_id: s.nextOppId };
    return { ...s, opportunities: [...s.opportunities, newOpp!], nextOppId: s.nextOppId + 1 };
  });
  return newOpp!;
}

// ─── Eligibility Engine ───────────────────────────────────────
// Implements all 3 DB constraint-based rules from the schema

export async function checkEligibility(studentId: number, oppId: number): Promise<EligibilityResult> {
  await delay(20);
  const student = getState().students.find(s => s.student_id === studentId)!;
  const opp = getState().opportunities.find(o => o.opp_id === oppId)!;
  const oppBranchIds = opportunityBranches.filter(ob => ob.opp_id === oppId).map(ob => ob.branch_id);
  const openToAll = oppBranchIds.length === 0;

  const cgpaCheck = { pass: student.cgpa >= opp.min_cgpa, studentCgpa: student.cgpa, required: opp.min_cgpa };
  const yearCheck = {
    pass: student.current_year >= opp.min_year && student.current_year <= opp.max_year,
    studentYear: student.current_year, minYear: opp.min_year, maxYear: opp.max_year,
  };
  const branchCheck = {
    pass: openToAll || oppBranchIds.includes(student.branch_id),
    studentBranchId: student.branch_id, openToAll, allowedBranchIds: oppBranchIds,
  };
  return {
    opp_id: oppId,
    isEligible: cgpaCheck.pass && yearCheck.pass && branchCheck.pass,
    cgpaCheck, yearCheck, branchCheck,
  };
}

export async function checkEligibilityBatch(studentId: number, oppIds: number[]): Promise<EligibilityResult[]> {
  return Promise.all(oppIds.map(id => checkEligibility(studentId, id)));
}

// ─── Skill Match Calculator ───────────────────────────────────

export async function calculateSkillMatch(studentId: number, oppId: number): Promise<SkillMatchResult> {
  await delay(20);
  const studentSkillsForStudent = getState().studentSkills.filter(s => s.student_id === studentId);
  const studentSkillIds = new Set(studentSkillsForStudent.map(s => s.skill_id));
  const oppSkills = opportunitySkills.filter(os => os.opp_id === oppId);

  const mandatory = oppSkills.filter(os => os.is_mandatory);
  const optional = oppSkills.filter(os => !os.is_mandatory);

  const matchedMandatory = mandatory.filter(os => studentSkillIds.has(os.skill_id));
  const matchedOptional = optional.filter(os => studentSkillIds.has(os.skill_id));

  const matchedSkills = [...matchedMandatory, ...matchedOptional].map(os => ({
    skill: skills.find(sk => sk.skill_id === os.skill_id)!,
    proficiency: studentSkillsForStudent.find(ss => ss.skill_id === os.skill_id)!.proficiency,
    is_mandatory: os.is_mandatory,
  }));

  const missingMandatory = mandatory
    .filter(os => !studentSkillIds.has(os.skill_id))
    .map(os => skills.find(sk => sk.skill_id === os.skill_id)!);
  const missingOptional = optional
    .filter(os => !studentSkillIds.has(os.skill_id))
    .map(os => skills.find(sk => sk.skill_id === os.skill_id)!);

  const total = oppSkills.length;
  // Score weights mandatory skills 3x
  const weightedMax = mandatory.length * 3 + optional.length;
  const weightedScore = matchedMandatory.length * 3 + matchedOptional.length;
  const matchScore = total === 0 ? 100 : Math.round((weightedScore / weightedMax) * 100);

  return {
    opp_id: oppId,
    mandatoryTotal: mandatory.length,
    mandatoryMatched: matchedMandatory.length,
    optionalTotal: optional.length,
    optionalMatched: matchedOptional.length,
    matchScore,
    matchedSkills,
    missingMandatory,
    missingOptional,
  };
}

// ─── Applications ─────────────────────────────────────────────

export async function getApplicationsForStudent(studentId: number): Promise<EnrichedApplication[]> {
  await delay();
  const state = getState();
  const apps = state.applications.filter(a => a.student_id === studentId);
  return apps.map(app => ({
    ...app,
    opportunity: enrichOpportunity(getState().opportunities.find(o => o.opp_id === app.opp_id)!),
    history: state.history.filter(h => h.application_id === app.application_id)
      .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()),
  }));
}

export async function getApplicationById(applicationId: number): Promise<EnrichedApplication | null> {
  await delay();
  const state = getState();
  const app = state.applications.find(a => a.application_id === applicationId);
  if (!app) return null;
  const opp = state.opportunities.find(o => o.opp_id === app.opp_id);
  if (!opp) return null;
  return {
    ...app,
    opportunity: enrichOpportunity(opp),
    history: state.history.filter(h => h.application_id === app.application_id)
      .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()),
  };
}

export async function getApplicationForStudentAndOpp(studentId: number, oppId: number): Promise<Application | null> {
  await delay(20);
  return getState().applications.find(a => a.student_id === studentId && a.opp_id === oppId) ?? null;
}

// POST /api/applications — enforces UNIQUE(student_id, opp_id)
export async function createApplication(
  studentId: number, oppId: number, status: 'Saved' | 'Applied' = 'Applied', note?: string
): Promise<Application> {
  await delay();
  const existing = getState().applications.find(a => a.student_id === studentId && a.opp_id === oppId);
  if (existing) throw new Error(`Application already exists (id=${existing.application_id})`);

  const now = new Date().toISOString();
  let newApp: Application | null = null;
  let newHistEntry: ApplicationStatusHistory | null = null;

  setState(s => {
    newApp = { application_id: s.nextApplicationId, student_id: studentId, opp_id: oppId, status, created_at: now, updated_at: now };
    newHistEntry = { history_id: s.nextHistoryId, application_id: s.nextApplicationId, status, changed_at: now, note: note ?? null };
    return {
      ...s,
      applications: [...s.applications, newApp!],
      history: [...s.history, newHistEntry!],
      nextApplicationId: s.nextApplicationId + 1,
      nextHistoryId: s.nextHistoryId + 1,
    };
  });
  return newApp!;
}

// PATCH /api/applications/:id/status — updates status + appends history row
export async function updateApplicationStatus(
  applicationId: number, newStatus: ApplicationStatus, note?: string
): Promise<Application> {
  await delay();
  const now = new Date().toISOString();
  let updated: Application | null = null;

  setState(s => {
    const idx = s.applications.findIndex(a => a.application_id === applicationId);
    if (idx === -1) throw new Error('Application not found');
    const newApps = [...s.applications];
    newApps[idx] = { ...newApps[idx], status: newStatus, updated_at: now };
    updated = newApps[idx];
    const histEntry: ApplicationStatusHistory = {
      history_id: s.nextHistoryId, application_id: applicationId,
      status: newStatus, changed_at: now, note: note ?? null,
    };
    return { ...s, applications: newApps, history: [...s.history, histEntry], nextHistoryId: s.nextHistoryId + 1 };
  });
  return updated!;
}

export async function deleteApplication(applicationId: number): Promise<void> {
  await delay();
  setState(s => ({
    ...s,
    applications: s.applications.filter(a => a.application_id !== applicationId),
    history: s.history.filter(h => h.application_id !== applicationId),
  }));
}

// ─── Dashboard Intelligence ────────────────────────────────────

export interface DashboardStats {
  eligibleActiveCount: number;
  submittedCount: number;
  interviewShortlistCount: number;
  avgSkillMatch: number;
  topRecommended: Array<EnrichedOpportunity & { eligibility: EligibilityResult; skillMatch: SkillMatchResult }>;
  upcomingDeadlines: Array<EnrichedOpportunity & { isExpired: boolean; daysLeft: number }>;
}

export async function getDashboardStats(studentId: number): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [allOpps, apps] = await Promise.all([
    getOpportunities(),
    getApplicationsForStudent(studentId),
  ]);

  const eligibilityResults = await checkEligibilityBatch(studentId, allOpps.map(o => o.opp_id));
  const eligibleOpps = allOpps.filter((_, i) => eligibilityResults[i].isEligible);

  // Filter active (non-expired for new opportunities; closed opps can still show in tracker)
  const activeEligible = eligibleOpps.filter(o => new Date(o.deadline) >= today);

  // Skill matches for all opps
  const skillMatches = await Promise.all(allOpps.map(o => calculateSkillMatch(studentId, o.opp_id)));

  const submittedCount = apps.filter(a => !(['Saved'].includes(a.status))).length;
  const interviewShortlistCount = apps.filter(a => ['Shortlisted', 'Interview', 'Selected'].includes(a.status)).length;

  // Top recommended: eligible, active, sorted by skill match
  const topRecommended = eligibleOpps
    .filter(o => new Date(o.deadline) >= today)
    .map(o => ({
      ...o,
      eligibility: eligibilityResults[allOpps.findIndex(ao => ao.opp_id === o.opp_id)],
      skillMatch: skillMatches[allOpps.findIndex(ao => ao.opp_id === o.opp_id)],
    }))
    .sort((a, b) => b.skillMatch.matchScore - a.skillMatch.matchScore)
    .slice(0, 5);

  const validMatches = skillMatches.filter(sm => sm.mandatoryTotal > 0 || sm.optionalTotal > 0);
  const avgSkillMatch = validMatches.length > 0
    ? Math.round(validMatches.reduce((sum, sm) => sum + sm.matchScore, 0) / validMatches.length)
    : 0;

  // Upcoming deadlines: all opps sorted by deadline (closest first)
  const upcomingDeadlines = allOpps
    .map(o => {
      const deadline = new Date(o.deadline);
      const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...o, isExpired: diff < 0, daysLeft: diff };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 8);

  return {
    eligibleActiveCount: activeEligible.length,
    submittedCount,
    interviewShortlistCount,
    avgSkillMatch,
    topRecommended,
    upcomingDeadlines,
  };
}
