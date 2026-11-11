// ============================================================
// OpportunityOS — Mock Database (Seed Data)
// Exactly mirrors the SQL sample dataset
// ============================================================

import type {
  Domain, Branch, Location, Skill, Organization,
  Student, Opportunity, StudentSkill, StudentDomain,
  OpportunitySkill, OpportunityBranch, Application,
  ApplicationStatusHistory,
} from '../types/database';

// ─── Table 1: domains ─────────────────────────────────────────
export const domains: Domain[] = [
  { domain_id: 1, domain_name: 'AI/ML' },
  { domain_id: 2, domain_name: 'Web Development' },
  { domain_id: 3, domain_name: 'Data Science' },
  { domain_id: 4, domain_name: 'Cybersecurity' },
  { domain_id: 5, domain_name: 'Embedded Systems' },
  { domain_id: 6, domain_name: 'Research' },
];

// ─── Table 2: branches ────────────────────────────────────────
export const branches: Branch[] = [
  { branch_id: 1, branch_name: 'Computer Science' },
  { branch_id: 2, branch_name: 'Information Technology' },
  { branch_id: 3, branch_name: 'Electronics and Communication' },
  { branch_id: 4, branch_name: 'Electrical Engineering' },
  { branch_id: 5, branch_name: 'Mechanical Engineering' },
];

// ─── Table 3: locations ───────────────────────────────────────
export const locations: Location[] = [
  { location_id: 1, city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { location_id: 2, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { location_id: 3, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { location_id: 4, city: 'Pune', state: 'Maharashtra', country: 'India' },
  { location_id: 5, city: 'Delhi', state: 'Delhi', country: 'India' },
  { location_id: 6, city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { location_id: 7, city: 'Vijayawada', state: 'Andhra Pradesh', country: 'India' },
];

// ─── Table 4: skills ──────────────────────────────────────────
export const skills: Skill[] = [
  { skill_id: 1,  skill_name: 'Python',              domain_id: null },
  { skill_id: 2,  skill_name: 'SQL',                 domain_id: null },
  { skill_id: 3,  skill_name: 'Machine Learning',    domain_id: 1 },
  { skill_id: 4,  skill_name: 'Deep Learning',       domain_id: 1 },
  { skill_id: 5,  skill_name: 'HTML/CSS',            domain_id: 2 },
  { skill_id: 6,  skill_name: 'JavaScript',          domain_id: 2 },
  { skill_id: 7,  skill_name: 'React',               domain_id: 2 },
  { skill_id: 8,  skill_name: 'Pandas',              domain_id: 3 },
  { skill_id: 9,  skill_name: 'Data Visualization',  domain_id: 3 },
  { skill_id: 10, skill_name: 'Network Security',    domain_id: 4 },
  { skill_id: 11, skill_name: 'Ethical Hacking',     domain_id: 4 },
  { skill_id: 12, skill_name: 'C Programming',       domain_id: 5 },
  { skill_id: 13, skill_name: 'Microcontrollers',    domain_id: 5 },
  { skill_id: 14, skill_name: 'Technical Writing',   domain_id: 6 },
  { skill_id: 15, skill_name: 'Git',                 domain_id: null },
];

// ─── Table 5: organizations ───────────────────────────────────
export const organizations: Organization[] = [
  { org_id: 1, org_name: 'Nimbus Labs',               org_type: 'Company',    website: 'https://nimbuslab.io',      hq_location_id: 2, data_source: 'Synthetic' },
  { org_id: 2, org_name: 'Orbit Analytics',            org_type: 'Company',    website: 'https://orbitanalytics.in', hq_location_id: 1, data_source: 'Synthetic' },
  { org_id: 3, org_name: 'Southern Tech University',   org_type: 'University', website: 'https://stu.ac.in',         hq_location_id: 3, data_source: 'Synthetic' },
  { org_id: 4, org_name: 'OpenSkills Foundation',      org_type: 'NGO',        website: 'https://openskills.org',    hq_location_id: 5, data_source: 'Synthetic' },
  { org_id: 5, org_name: 'Citadel Secure',             org_type: 'Company',    website: 'https://citadelsecure.io',  hq_location_id: 4, data_source: 'Synthetic' },
  { org_id: 6, org_name: 'National Research Council',  org_type: 'Government', website: 'https://nrc.gov.in',        hq_location_id: 5, data_source: 'Synthetic' },
  { org_id: 7, org_name: 'PixelForge Studio',          org_type: 'Company',    website: 'https://pixelforge.in',     hq_location_id: 6, data_source: 'Synthetic' },
  { org_id: 8, org_name: 'Circuit Works',              org_type: 'Company',    website: 'https://circuitworks.io',   hq_location_id: null, data_source: 'Synthetic' },
];

// ─── Table 6: students ────────────────────────────────────────
export const students: Student[] = [
  { student_id: 1, full_name: 'Aarav Reddy',   email: 'aarav.reddy@demo.edu',   college_name: 'Demo Institute of Technology', branch_id: 1, current_year: 3, cgpa: 8.70, preferred_work_mode: 'Remote',  home_location_id: 1, created_at: '2025-01-10T09:00:00Z' },
  { student_id: 2, full_name: 'Meera Iyer',    email: 'meera.iyer@demo.edu',    college_name: 'Demo Institute of Technology', branch_id: 2, current_year: 2, cgpa: 9.10, preferred_work_mode: 'Any',     home_location_id: 3, created_at: '2025-01-12T10:30:00Z' },
  { student_id: 3, full_name: 'Rohan Sharma',  email: 'rohan.sharma@demo.edu',  college_name: 'Demo Institute of Technology', branch_id: 3, current_year: 4, cgpa: 7.40, preferred_work_mode: 'Onsite', home_location_id: 5, created_at: '2025-01-15T11:00:00Z' },
  { student_id: 4, full_name: 'Ananya Rao',    email: 'ananya.rao@demo.edu',    college_name: 'Demo Institute of Technology', branch_id: 1, current_year: 1, cgpa: 8.20, preferred_work_mode: 'Hybrid',  home_location_id: 2, created_at: '2025-02-01T08:00:00Z' },
  { student_id: 5, full_name: 'Karthik Nair',  email: 'karthik.nair@demo.edu',  college_name: 'Demo Institute of Technology', branch_id: 4, current_year: 3, cgpa: 6.80, preferred_work_mode: 'Any',     home_location_id: null, created_at: '2025-02-05T09:45:00Z' },
  { student_id: 6, full_name: 'Sneha Patel',   email: 'sneha.patel@demo.edu',   college_name: 'Demo Institute of Technology', branch_id: 1, current_year: 4, cgpa: 9.40, preferred_work_mode: 'Remote',  home_location_id: 4, created_at: '2025-02-10T12:00:00Z' },
];

// ─── Table 7: opportunities ───────────────────────────────────
export const opportunities: Opportunity[] = [
  {
    opp_id: 1,  org_id: 1, domain_id: 1, location_id: 2,
    title: 'ML Engineering Intern',
    opp_type: 'Internship', description: 'Work on production ML pipelines and model serving infrastructure at Nimbus Labs. Collaborate with senior engineers on real-world AI systems.',
    work_mode: 'Hybrid',  reward_amount: 15000, reward_unit: 'Per month', duration_weeks: 8,
    posted_date: '2026-06-01', deadline: '2026-11-15',
    application_url: 'https://nimbuslab.io/apply', min_cgpa: 8.0, min_year: 2, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 2,  org_id: 7, domain_id: 2, location_id: 6,
    title: 'Frontend Developer Intern',
    opp_type: 'Internship', description: 'Build pixel-perfect UI components in React for PixelForge\'s flagship SaaS products. Own the design system from day one.',
    work_mode: 'Onsite', reward_amount: 12000, reward_unit: 'Per month', duration_weeks: 6,
    posted_date: '2026-06-10', deadline: '2026-11-20',
    application_url: 'https://pixelforge.in/careers', min_cgpa: 7.5, min_year: 2, max_year: 3, data_source: 'Synthetic',
  },
  {
    opp_id: 3,  org_id: 2, domain_id: 3, location_id: 1,
    title: 'Data Analyst Intern',
    opp_type: 'Internship', description: 'Perform exploratory data analysis, build dashboards, and generate insights from large datasets at Orbit Analytics.',
    work_mode: 'Remote',  reward_amount: 10000, reward_unit: 'Per month', duration_weeks: 8,
    posted_date: '2026-06-15', deadline: '2026-11-25',
    application_url: 'https://orbitanalytics.in/intern', min_cgpa: 7.0, min_year: 2, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 4,  org_id: 2, domain_id: 3, location_id: null,
    title: 'Data Science Hackathon',
    opp_type: 'Hackathon', description: 'A 48-hour virtual hackathon focused on building predictive models on real-world datasets. Open to all branches!',
    work_mode: 'Remote',  reward_amount: 50000, reward_unit: 'One time', duration_weeks: null,
    posted_date: '2026-07-01', deadline: '2026-11-30',
    application_url: 'https://orbitanalytics.in/hackathon', min_cgpa: 0.0, min_year: 1, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 5,  org_id: 3, domain_id: 1, location_id: 3,
    title: 'Summer Research Fellow',
    opp_type: 'Research', description: 'Conduct independent AI research under faculty guidance at Southern Tech University. Publish at a top-tier venue.',
    work_mode: 'Onsite', reward_amount: 8000, reward_unit: 'Per month', duration_weeks: 10,
    posted_date: '2026-07-05', deadline: '2026-12-01',
    application_url: 'https://stu.ac.in/research', min_cgpa: 8.5, min_year: 3, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 6,  org_id: 6, domain_id: 1, location_id: 5,
    title: 'AI Research Assistant',
    opp_type: 'Research', description: 'Assist senior researchers at the National Research Council in AI policy and algorithm development projects.',
    work_mode: 'Hybrid', reward_amount: 20000, reward_unit: 'Per month', duration_weeks: 12,
    posted_date: '2026-07-10', deadline: '2026-12-05',
    application_url: 'https://nrc.gov.in/ai-assistant', min_cgpa: 8.0, min_year: 3, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 7,  org_id: 4, domain_id: 2, location_id: null,
    title: 'Open Source Web Challenge',
    opp_type: 'Competition', description: 'Contribute to open-source web projects and win prizes. Any branch welcome — creativity matters more than your major!',
    work_mode: 'Remote',  reward_amount: 25000, reward_unit: 'One time', duration_weeks: null,
    posted_date: '2026-07-15', deadline: '2026-12-10',
    application_url: 'https://openskills.org/challenge', min_cgpa: 0.0, min_year: 1, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 8,  org_id: 3, domain_id: 6, location_id: null,
    title: 'STEM Merit Scholarship',
    opp_type: 'Scholarship', description: 'Full tuition scholarship for high-achieving STEM students. Open to all branches with a GPA above 8.5.',
    work_mode: 'Remote',  reward_amount: 100000, reward_unit: 'One time', duration_weeks: null,
    posted_date: '2026-07-20', deadline: '2026-12-15',
    application_url: 'https://stu.ac.in/scholarship', min_cgpa: 8.5, min_year: 1, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 9,  org_id: 5, domain_id: 4, location_id: 4,
    title: 'Security Analyst Intern',
    opp_type: 'Internship', description: 'Join Citadel Secure\'s red team, conduct penetration tests, and write security assessments for enterprise clients.',
    work_mode: 'Onsite', reward_amount: 18000, reward_unit: 'Per month', duration_weeks: 8,
    posted_date: '2026-08-01', deadline: '2026-12-20',
    application_url: 'https://citadelsecure.io/jobs', min_cgpa: 7.0, min_year: 3, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 10, org_id: 5, domain_id: 4, location_id: null,
    title: 'Capture The Flag Contest',
    opp_type: 'Competition', description: 'National-level CTF competition covering cryptography, web security, and reverse engineering. All branches may participate!',
    work_mode: 'Remote',  reward_amount: 30000, reward_unit: 'One time', duration_weeks: null,
    posted_date: '2026-08-05', deadline: '2026-12-22',
    application_url: 'https://citadelsecure.io/ctf', min_cgpa: 0.0, min_year: 1, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 11, org_id: 6, domain_id: 6, location_id: 5,
    title: 'Government Research Internship',
    opp_type: 'Research', description: 'Work on policy-oriented research projects at the National Research Council. Stipend + accommodation provided.',
    work_mode: 'Onsite', reward_amount: 12000, reward_unit: 'Per month', duration_weeks: 12,
    posted_date: '2026-08-10', deadline: '2026-12-25',
    application_url: 'https://nrc.gov.in/intern', min_cgpa: 7.5, min_year: 3, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 12, org_id: 7, domain_id: 2, location_id: 6,
    title: 'UI Engineering Intern',
    opp_type: 'Internship', description: 'Design and ship high-quality UI components for PixelForge\'s creative tools suite. TypeScript + Figma experience preferred.',
    work_mode: 'Hybrid', reward_amount: 14000, reward_unit: 'Per month', duration_weeks: 6,
    posted_date: '2026-08-15', deadline: '2026-12-28',
    application_url: 'https://pixelforge.in/ui-intern', min_cgpa: 7.0, min_year: 2, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 13, org_id: 8, domain_id: 5, location_id: null,
    title: 'Embedded Systems Intern',
    opp_type: 'Internship', description: 'Develop firmware for IoT devices at Circuit Works. Work with ARM Cortex-M4, FreeRTOS, and low-level peripherals.',
    work_mode: 'Remote',  reward_amount: 10000, reward_unit: 'Per month', duration_weeks: 8,
    posted_date: '2026-08-20', deadline: '2026-12-30',
    application_url: 'https://circuitworks.io/intern', min_cgpa: 6.5, min_year: 2, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 14, org_id: 1, domain_id: 1, location_id: null,
    title: 'Kaggle-style ML Contest',
    opp_type: 'Competition', description: 'Compete in a structured ML contest with real-world datasets. Build and submit models to win cash prizes. Open to all branches!',
    work_mode: 'Remote',  reward_amount: 40000, reward_unit: 'One time', duration_weeks: null,
    posted_date: '2026-09-01', deadline: '2026-11-05',
    application_url: 'https://nimbuslab.io/contest', min_cgpa: 0.0, min_year: 1, max_year: 4, data_source: 'Synthetic',
  },
  {
    opp_id: 15, org_id: 2, domain_id: 3, location_id: 1,
    title: 'Past Analytics Internship',
    opp_type: 'Internship', description: 'CLOSED — This internship has ended. Shown for historical tracking purposes.',
    work_mode: 'Hybrid', reward_amount: 11000, reward_unit: 'Per month', duration_weeks: 6,
    posted_date: '2026-01-01', deadline: '2026-09-15',
    application_url: 'https://orbitanalytics.in/past', min_cgpa: 7.0, min_year: 2, max_year: 4, data_source: 'Synthetic',
  },
];

// ─── Table 8: student_skills ──────────────────────────────────
export const studentSkills: StudentSkill[] = [
  // Aarav Reddy (1) — CS, Yr3, 8.70
  { student_id: 1, skill_id: 1,  proficiency: 'Advanced' },
  { student_id: 1, skill_id: 3,  proficiency: 'Intermediate' },
  { student_id: 1, skill_id: 4,  proficiency: 'Beginner' },
  { student_id: 1, skill_id: 8,  proficiency: 'Intermediate' },
  { student_id: 1, skill_id: 15, proficiency: 'Advanced' },

  // Meera Iyer (2) — IT, Yr2, 9.10
  { student_id: 2, skill_id: 5,  proficiency: 'Advanced' },
  { student_id: 2, skill_id: 6,  proficiency: 'Advanced' },
  { student_id: 2, skill_id: 7,  proficiency: 'Intermediate' },
  { student_id: 2, skill_id: 15, proficiency: 'Intermediate' },
  { student_id: 2, skill_id: 2,  proficiency: 'Beginner' },

  // Rohan Sharma (3) — ECE, Yr4, 7.40
  { student_id: 3, skill_id: 10, proficiency: 'Intermediate' },
  { student_id: 3, skill_id: 11, proficiency: 'Beginner' },
  { student_id: 3, skill_id: 1,  proficiency: 'Intermediate' },
  { student_id: 3, skill_id: 15, proficiency: 'Intermediate' },

  // Ananya Rao (4) — CS, Yr1, 8.20
  { student_id: 4, skill_id: 1,  proficiency: 'Beginner' },
  { student_id: 4, skill_id: 5,  proficiency: 'Intermediate' },
  { student_id: 4, skill_id: 6,  proficiency: 'Beginner' },
  { student_id: 4, skill_id: 15, proficiency: 'Beginner' },

  // Karthik Nair (5) — EE, Yr3, 6.80
  { student_id: 5, skill_id: 12, proficiency: 'Advanced' },
  { student_id: 5, skill_id: 13, proficiency: 'Intermediate' },
  { student_id: 5, skill_id: 1,  proficiency: 'Beginner' },
  { student_id: 5, skill_id: 15, proficiency: 'Beginner' },

  // Sneha Patel (6) — CS, Yr4, 9.40
  { student_id: 6, skill_id: 1,  proficiency: 'Advanced' },
  { student_id: 6, skill_id: 3,  proficiency: 'Advanced' },
  { student_id: 6, skill_id: 4,  proficiency: 'Intermediate' },
  { student_id: 6, skill_id: 2,  proficiency: 'Intermediate' },
  { student_id: 6, skill_id: 8,  proficiency: 'Advanced' },
  { student_id: 6, skill_id: 14, proficiency: 'Intermediate' },
  { student_id: 6, skill_id: 15, proficiency: 'Advanced' },
];

// ─── Table 9: student_domains ─────────────────────────────────
export const studentDomains: StudentDomain[] = [
  { student_id: 1, domain_id: 1 }, // Aarav → AI/ML
  { student_id: 1, domain_id: 3 }, // Aarav → Data Science
  { student_id: 2, domain_id: 2 }, // Meera → Web Dev
  { student_id: 3, domain_id: 4 }, // Rohan → Cybersecurity
  { student_id: 4, domain_id: 2 }, // Ananya → Web Dev
  { student_id: 4, domain_id: 1 }, // Ananya → AI/ML
  { student_id: 5, domain_id: 5 }, // Karthik → Embedded Systems
  { student_id: 6, domain_id: 1 }, // Sneha → AI/ML
  { student_id: 6, domain_id: 3 }, // Sneha → Data Science
  { student_id: 6, domain_id: 6 }, // Sneha → Research
];

// ─── Table 10: opportunity_skills ─────────────────────────────
export const opportunitySkills: OpportunitySkill[] = [
  // Opp 1: ML Engineering Intern
  { opp_id: 1, skill_id: 1,  is_mandatory: true },
  { opp_id: 1, skill_id: 3,  is_mandatory: true },
  { opp_id: 1, skill_id: 4,  is_mandatory: false },
  { opp_id: 1, skill_id: 15, is_mandatory: false },

  // Opp 2: Frontend Developer Intern
  { opp_id: 2, skill_id: 5,  is_mandatory: true },
  { opp_id: 2, skill_id: 6,  is_mandatory: true },
  { opp_id: 2, skill_id: 7,  is_mandatory: false },
  { opp_id: 2, skill_id: 15, is_mandatory: false },

  // Opp 3: Data Analyst Intern
  { opp_id: 3, skill_id: 1,  is_mandatory: true },
  { opp_id: 3, skill_id: 2,  is_mandatory: true },
  { opp_id: 3, skill_id: 8,  is_mandatory: false },
  { opp_id: 3, skill_id: 9,  is_mandatory: false },

  // Opp 4: Data Science Hackathon
  { opp_id: 4, skill_id: 1,  is_mandatory: true },
  { opp_id: 4, skill_id: 8,  is_mandatory: false },
  { opp_id: 4, skill_id: 9,  is_mandatory: false },

  // Opp 5: Summer Research Fellow
  { opp_id: 5, skill_id: 1,  is_mandatory: true },
  { opp_id: 5, skill_id: 3,  is_mandatory: true },
  { opp_id: 5, skill_id: 14, is_mandatory: false },

  // Opp 6: AI Research Assistant
  { opp_id: 6, skill_id: 1,  is_mandatory: true },
  { opp_id: 6, skill_id: 3,  is_mandatory: true },
  { opp_id: 6, skill_id: 4,  is_mandatory: false },
  { opp_id: 6, skill_id: 14, is_mandatory: false },

  // Opp 7: Open Source Web Challenge
  { opp_id: 7, skill_id: 6,  is_mandatory: true },
  { opp_id: 7, skill_id: 7,  is_mandatory: false },
  { opp_id: 7, skill_id: 15, is_mandatory: false },

  // Opp 8: STEM Merit Scholarship
  { opp_id: 8, skill_id: 14, is_mandatory: false },

  // Opp 9: Security Analyst Intern
  { opp_id: 9, skill_id: 10, is_mandatory: true },
  { opp_id: 9, skill_id: 11, is_mandatory: false },
  { opp_id: 9, skill_id: 1,  is_mandatory: false },

  // Opp 10: CTF Contest
  { opp_id: 10, skill_id: 10, is_mandatory: false },
  { opp_id: 10, skill_id: 11, is_mandatory: false },

  // Opp 11: Government Research Internship
  { opp_id: 11, skill_id: 14, is_mandatory: true },
  { opp_id: 11, skill_id: 1,  is_mandatory: false },
  { opp_id: 11, skill_id: 2,  is_mandatory: false },

  // Opp 12: UI Engineering Intern
  { opp_id: 12, skill_id: 5,  is_mandatory: true },
  { opp_id: 12, skill_id: 7,  is_mandatory: true },
  { opp_id: 12, skill_id: 6,  is_mandatory: false },
  { opp_id: 12, skill_id: 15, is_mandatory: false },

  // Opp 13: Embedded Systems Intern
  { opp_id: 13, skill_id: 12, is_mandatory: true },
  { opp_id: 13, skill_id: 13, is_mandatory: false },
  { opp_id: 13, skill_id: 1,  is_mandatory: false },

  // Opp 14: Kaggle ML Contest
  { opp_id: 14, skill_id: 1,  is_mandatory: true },
  { opp_id: 14, skill_id: 3,  is_mandatory: false },
  { opp_id: 14, skill_id: 8,  is_mandatory: false },

  // Opp 15: Past Analytics Internship
  { opp_id: 15, skill_id: 2,  is_mandatory: true },
  { opp_id: 15, skill_id: 8,  is_mandatory: false },
  { opp_id: 15, skill_id: 9,  is_mandatory: false },
];

// ─── Table 11: opportunity_branches ───────────────────────────
// Opps 4, 7, 8, 10, 14, 15 have NO rows → open to ALL branches
export const opportunityBranches: OpportunityBranch[] = [
  // Opp 1: ML Intern → CS, IT
  { opp_id: 1, branch_id: 1 },
  { opp_id: 1, branch_id: 2 },

  // Opp 2: Frontend Intern → CS, IT
  { opp_id: 2, branch_id: 1 },
  { opp_id: 2, branch_id: 2 },

  // Opp 3: Data Analyst Intern → CS, IT, ECE
  { opp_id: 3, branch_id: 1 },
  { opp_id: 3, branch_id: 2 },
  { opp_id: 3, branch_id: 3 },

  // Opp 5: Summer Research Fellow → CS, IT
  { opp_id: 5, branch_id: 1 },
  { opp_id: 5, branch_id: 2 },

  // Opp 6: AI Research Assistant → CS, IT
  { opp_id: 6, branch_id: 1 },
  { opp_id: 6, branch_id: 2 },

  // Opp 9: Security Analyst Intern → CS, IT, ECE
  { opp_id: 9, branch_id: 1 },
  { opp_id: 9, branch_id: 2 },
  { opp_id: 9, branch_id: 3 },

  // Opp 11: Government Research Intern → CS, IT, ECE, EE
  { opp_id: 11, branch_id: 1 },
  { opp_id: 11, branch_id: 2 },
  { opp_id: 11, branch_id: 3 },
  { opp_id: 11, branch_id: 4 },

  // Opp 12: UI Engineering Intern → CS, IT
  { opp_id: 12, branch_id: 1 },
  { opp_id: 12, branch_id: 2 },

  // Opp 13: Embedded Systems Intern → ECE, EE
  { opp_id: 13, branch_id: 3 },
  { opp_id: 13, branch_id: 4 },
];

// ─── Table 12: applications ───────────────────────────────────
export const applications: Application[] = [
  { application_id: 1,  student_id: 1, opp_id: 1,  status: 'Applied',      created_at: '2026-09-01T10:00:00Z', updated_at: '2026-09-01T10:00:00Z' },
  { application_id: 2,  student_id: 1, opp_id: 4,  status: 'Shortlisted',  created_at: '2026-09-05T11:00:00Z', updated_at: '2026-09-10T14:00:00Z' },
  { application_id: 3,  student_id: 1, opp_id: 14, status: 'Saved',        created_at: '2026-09-12T09:00:00Z', updated_at: '2026-09-12T09:00:00Z' },
  { application_id: 4,  student_id: 2, opp_id: 2,  status: 'Interview',    created_at: '2026-09-03T08:30:00Z', updated_at: '2026-09-18T10:00:00Z' },
  { application_id: 5,  student_id: 2, opp_id: 7,  status: 'Applied',      created_at: '2026-09-08T13:00:00Z', updated_at: '2026-09-08T13:00:00Z' },
  { application_id: 6,  student_id: 3, opp_id: 9,  status: 'Applied',      created_at: '2026-09-10T09:00:00Z', updated_at: '2026-09-10T09:00:00Z' },
  { application_id: 7,  student_id: 6, opp_id: 1,  status: 'Selected',     created_at: '2026-08-20T08:00:00Z', updated_at: '2026-10-01T12:00:00Z' },
  { application_id: 8,  student_id: 6, opp_id: 5,  status: 'Interview',    created_at: '2026-08-25T09:00:00Z', updated_at: '2026-09-28T11:00:00Z' },
  { application_id: 9,  student_id: 6, opp_id: 6,  status: 'Applied',      created_at: '2026-09-01T10:30:00Z', updated_at: '2026-09-01T10:30:00Z' },
  { application_id: 10, student_id: 5, opp_id: 13, status: 'Saved',        created_at: '2026-09-15T14:00:00Z', updated_at: '2026-09-15T14:00:00Z' },
];

// ─── Table 13: application_status_history ─────────────────────
export const applicationStatusHistory: ApplicationStatusHistory[] = [
  // App 1 — Aarav → ML Intern
  { history_id: 1,  application_id: 1,  status: 'Applied',     changed_at: '2026-09-01T10:00:00Z', note: 'Submitted application via portal' },

  // App 2 — Aarav → DS Hackathon
  { history_id: 2,  application_id: 2,  status: 'Applied',     changed_at: '2026-09-05T11:00:00Z', note: 'Registered for the hackathon' },
  { history_id: 3,  application_id: 2,  status: 'Shortlisted', changed_at: '2026-09-10T14:00:00Z', note: 'Selected for Round 2' },

  // App 3 — Aarav → ML Contest (Saved)
  { history_id: 4,  application_id: 3,  status: 'Saved',       changed_at: '2026-09-12T09:00:00Z', note: 'Bookmarked for later' },

  // App 4 — Meera → Frontend Intern
  { history_id: 5,  application_id: 4,  status: 'Applied',     changed_at: '2026-09-03T08:30:00Z', note: 'Applied with portfolio link' },
  { history_id: 6,  application_id: 4,  status: 'Shortlisted', changed_at: '2026-09-12T10:00:00Z', note: 'Resume screened and approved' },
  { history_id: 7,  application_id: 4,  status: 'Interview',   changed_at: '2026-09-18T10:00:00Z', note: 'Technical interview scheduled for 25th Sep' },

  // App 5 — Meera → Open Source Challenge
  { history_id: 8,  application_id: 5,  status: 'Applied',     changed_at: '2026-09-08T13:00:00Z', note: 'Submitted PR on GitHub' },

  // App 6 — Rohan → Security Analyst Intern
  { history_id: 9,  application_id: 6,  status: 'Applied',     changed_at: '2026-09-10T09:00:00Z', note: 'Applied via company portal' },

  // App 7 — Sneha → ML Engineering Intern (Selected)
  { history_id: 10, application_id: 7,  status: 'Applied',     changed_at: '2026-08-20T08:00:00Z', note: 'Early application submitted' },
  { history_id: 11, application_id: 7,  status: 'Shortlisted', changed_at: '2026-08-28T09:00:00Z', note: 'Shortlisted from 500+ applicants' },
  { history_id: 12, application_id: 7,  status: 'Interview',   changed_at: '2026-09-05T10:00:00Z', note: 'DS + Algo round — cleared!' },
  { history_id: 13, application_id: 7,  status: 'Selected',    changed_at: '2026-10-01T12:00:00Z', note: 'Offer letter received 🎉' },

  // App 8 — Sneha → Summer Research Fellow
  { history_id: 14, application_id: 8,  status: 'Applied',     changed_at: '2026-08-25T09:00:00Z', note: 'Research statement submitted' },
  { history_id: 15, application_id: 8,  status: 'Shortlisted', changed_at: '2026-09-10T10:00:00Z', note: 'Proposal shortlisted' },
  { history_id: 16, application_id: 8,  status: 'Interview',   changed_at: '2026-09-28T11:00:00Z', note: 'Faculty interview scheduled' },

  // App 9 — Sneha → AI Research Assistant
  { history_id: 17, application_id: 9,  status: 'Applied',     changed_at: '2026-09-01T10:30:00Z', note: 'Submitted CV and writing sample' },

  // App 10 — Karthik → Embedded Systems Intern
  { history_id: 18, application_id: 10, status: 'Saved',       changed_at: '2026-09-15T14:00:00Z', note: 'Saved to apply later' },

  // Extra history entries for richer timelines
  { history_id: 19, application_id: 2,  status: 'Applied',     changed_at: '2026-09-05T11:00:00Z', note: null },
  { history_id: 20, application_id: 7,  status: 'Applied',     changed_at: '2026-08-20T08:00:00Z', note: null },
  { history_id: 21, application_id: 4,  status: 'Applied',     changed_at: '2026-09-03T08:30:00Z', note: null },
  { history_id: 22, application_id: 8,  status: 'Applied',     changed_at: '2026-08-25T09:00:00Z', note: null },
  { history_id: 23, application_id: 8,  status: 'Shortlisted', changed_at: '2026-09-10T10:00:00Z', note: null },
  { history_id: 24, application_id: 7,  status: 'Shortlisted', changed_at: '2026-08-28T09:00:00Z', note: null },
  { history_id: 25, application_id: 7,  status: 'Interview',   changed_at: '2026-09-05T10:00:00Z', note: null },
];
