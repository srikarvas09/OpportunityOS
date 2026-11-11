// ============================================================
// OpportunityOS — TypeScript Database Type Definitions
// Mirrors the exact MySQL 8.0 relational schema (13 tables)
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export type OrgType = 'Company' | 'University' | 'NGO' | 'Government' | 'Other';
export type DataSource = 'Real' | 'Synthetic';
export type WorkMode = 'Remote' | 'Onsite' | 'Hybrid';
export type PreferredWorkMode = 'Remote' | 'Onsite' | 'Hybrid' | 'Any';
export type OppType = 'Internship' | 'Research' | 'Hackathon' | 'Competition' | 'Scholarship';
export type RewardUnit = 'Per month' | 'One time';
export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced';
export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

// ─── Table 1: domains ─────────────────────────────────────────
export interface Domain {
  domain_id: number;
  domain_name: string;
}

// ─── Table 2: branches ────────────────────────────────────────
export interface Branch {
  branch_id: number;
  branch_name: string;
}

// ─── Table 3: locations ───────────────────────────────────────
export interface Location {
  location_id: number;
  city: string;
  state: string;
  country: string; // Default: 'India'
}

// ─── Table 4: skills ──────────────────────────────────────────
export interface Skill {
  skill_id: number;
  skill_name: string;
  domain_id: number | null; // null for general skills (Python, SQL, Git)
}

// ─── Table 5: organizations ───────────────────────────────────
export interface Organization {
  org_id: number;
  org_name: string;
  org_type: OrgType;
  website: string | null;
  hq_location_id: number | null;
  data_source: DataSource;
}

// ─── Table 6: students ────────────────────────────────────────
export interface Student {
  student_id: number;
  full_name: string;
  email: string;
  college_name: string;
  branch_id: number;
  current_year: 1 | 2 | 3 | 4; // CHECK (1 to 4)
  cgpa: number; // CHECK (0.00 to 10.00)
  preferred_work_mode: PreferredWorkMode;
  home_location_id: number | null;
  created_at: string; // ISO timestamp
}

// ─── Table 7: opportunities ───────────────────────────────────
export interface Opportunity {
  opp_id: number;
  org_id: number;
  domain_id: number;
  location_id: number | null; // nullable if Remote
  title: string;
  opp_type: OppType;
  description: string;
  work_mode: WorkMode;
  reward_amount: number | null;
  reward_unit: RewardUnit | null;
  duration_weeks: number | null;
  posted_date: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  application_url: string;
  min_cgpa: number; // 0–10
  min_year: 1 | 2 | 3 | 4;
  max_year: 1 | 2 | 3 | 4;
  data_source: DataSource;
}

// ─── Table 8: student_skills ──────────────────────────────────
export interface StudentSkill {
  student_id: number;
  skill_id: number;
  proficiency: Proficiency;
}

// ─── Table 9: student_domains ─────────────────────────────────
export interface StudentDomain {
  student_id: number;
  domain_id: number;
}

// ─── Table 10: opportunity_skills ─────────────────────────────
export interface OpportunitySkill {
  opp_id: number;
  skill_id: number;
  is_mandatory: boolean;
}

// ─── Table 11: opportunity_branches ───────────────────────────
// Business Rule: If NO rows exist for an opp_id → open to ALL branches
export interface OpportunityBranch {
  opp_id: number;
  branch_id: number;
}

// ─── Table 12: applications ───────────────────────────────────
// UNIQUE constraint: (student_id, opp_id)
export interface Application {
  application_id: number;
  student_id: number;
  opp_id: number;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

// ─── Table 13: application_status_history ─────────────────────
// Business Rule: status must always equal latest history row
export interface ApplicationStatusHistory {
  history_id: number;
  application_id: number;
  status: ApplicationStatus;
  changed_at: string;
  note: string | null;
}

// ─── Composite / Enriched Types (for UI use) ──────────────────

export interface EnrichedOpportunity extends Opportunity {
  organization: Organization;
  domain: Domain;
  location: Location | null;
  skills: Array<OpportunitySkill & { skill: Skill }>;
  branches: Branch[]; // empty = open to all
}

export interface EnrichedApplication extends Application {
  opportunity: EnrichedOpportunity;
  history: ApplicationStatusHistory[];
}

export interface EligibilityResult {
  opp_id: number;
  isEligible: boolean;
  cgpaCheck: { pass: boolean; studentCgpa: number; required: number };
  yearCheck: { pass: boolean; studentYear: number; minYear: number; maxYear: number };
  branchCheck: { pass: boolean; studentBranchId: number; openToAll: boolean; allowedBranchIds: number[] };
}

export interface SkillMatchResult {
  opp_id: number;
  mandatoryTotal: number;
  mandatoryMatched: number;
  optionalTotal: number;
  optionalMatched: number;
  matchScore: number; // 0–100
  matchedSkills: Array<{ skill: Skill; proficiency: Proficiency; is_mandatory: boolean }>;
  missingMandatory: Skill[];
  missingOptional: Skill[];
}
