# OpportunityOS — Frontend Architecture

> **React + Vite + TypeScript + Tailwind CSS**  
> Production-ready frontend for the Student Opportunity Intelligence Platform  
> Built against a MySQL 8.0–compatible relational schema with 13 tables

---

## 1. System Overview & Folder Structure

```
opportunityos/
├── public/
├── src/
│   ├── types/
│   │   └── database.ts          # All TypeScript interfaces mirroring the 13 SQL tables
│   ├── data/
│   │   └── mockDatabase.ts      # Exact seed data from the SQL INSERT script
│   ├── services/
│   │   └── api.ts               # Async API service layer (swap internals for real backend)
│   ├── context/
│   │   └── AppContext.tsx        # Global state: active student, toast notifications
│   ├── utils/
│   │   └── helpers.ts           # Formatters, cn(), badge configs, date utilities
│   ├── components/
│   │   ├── ui/
│   │   │   └── index.tsx        # Shared component library (Badge, Button, Card, Modal…)
│   │   ├── Layout.tsx           # Sidebar nav + student switcher + outlet wrapper
│   │   └── ToastContainer.tsx   # Toast notification renderer
│   ├── pages/
│   │   ├── DashboardPage.tsx    # /        — KPI cards, top recommendations, deadlines
│   │   ├── OpportunitiesPage.tsx # /opportunities — explorer, eligibility, skill match
│   │   ├── ApplicationsPage.tsx  # /applications  — Kanban, table, timeline drawer
│   │   ├── ProfilePage.tsx       # /profile       — edit profile, skill matrix, domains
│   │   ├── OrganizationsPage.tsx # /organizations — partner directory
│   │   └── AdminPage.tsx         # /admin         — post opportunity, data explorer
│   ├── App.tsx                   # BrowserRouter + Routes wiring
│   ├── main.tsx                  # ReactDOM entry point
│   └── index.css                 # @import "tailwindcss"
├── vite.config.ts                # Vite + @tailwindcss/vite + react plugin
├── tsconfig.json
├── package.json
└── FRONTEND_ARCHITECTURE.md     ← this file
```

### Directory Purpose Summary

| Directory | Responsibility |
|---|---|
| `src/types/` | Single source of truth for all TypeScript types. Mirrors SQL schema 1:1 so both frontend and backend speak the same language. |
| `src/data/` | Static seed data only. Never mutated directly — all changes go through `api.ts`. |
| `src/services/` | **The entire backend contract lives here.** All async I/O. UI never touches data directly. |
| `src/context/` | React Context for cross-cutting concerns (active student, toast queue). |
| `src/utils/` | Pure functions with no side effects: formatters, class merging, badge configs. |
| `src/components/ui/` | Headless-style, composable component primitives. Zero business logic. |
| `src/components/` | Layout shell and global UX components (toast renderer). |
| `src/pages/` | One file per route. Each page calls `api.ts` services only — never raw data. |

---

## 2. State & Data Flow Architecture

### 2.1 Active Student Context

```
AppProvider (AppContext.tsx)
  ├─ activeStudentId: number            (drives ALL eligibility/match recomputation)
  ├─ setActiveStudentId(id): void        (called by sidebar student switcher)
  ├─ activeStudent: Student | null       (fetched fresh when ID changes)
  ├─ students: Student[]                 (all 6 students — for the dropdown)
  ├─ toasts: Toast[]                     (notification queue)
  └─ showToast / dismissToast            (called by pages after API mutations)
```

**Data flow when user switches student:**
1. Sidebar switcher calls `setActiveStudentId(newId)`
2. `AppContext` re-fetches `activeStudent` via `api.getStudentById(newId)`
3. Every page that has `activeStudentId` in its `useEffect` dependency array re-fires
4. Dashboard, Opportunities, Applications all reload their data
5. Eligibility engine and skill match calculator run fresh for the new student
6. All badges, KPI cards, and filter results update simultaneously

### 2.2 Eligibility Engine

Implemented in `api.ts → checkEligibility(studentId, oppId)`:

```
EligibilityResult = {
  cgpaCheck  : student.cgpa >= opp.min_cgpa
  yearCheck  : student.current_year BETWEEN opp.min_year AND opp.max_year
  branchCheck: IF opportunity_branches is EMPTY → openToAll = true (pass)
               ELSE → student.branch_id IN opportunity_branches
  isEligible : cgpaCheck.pass && yearCheck.pass && branchCheck.pass
}
```

The "open-to-all branches" rule (Opps 4, 7, 8, 10, 14, 15) is enforced by:
```typescript
const oppBranchIds = opportunityBranches.filter(ob => ob.opp_id === oppId).map(ob => ob.branch_id);
const openToAll = oppBranchIds.length === 0; // ← the exact SQL business rule
```

`checkEligibilityBatch` runs all eligibility checks in parallel using `Promise.all`.

### 2.3 Skill Match Calculator

Implemented in `api.ts → calculateSkillMatch(studentId, oppId)`:

```
matchScore = weightedScore / weightedMax × 100
  where:
    weightedMax   = (mandatory skills × 3) + optional skills
    weightedScore = (matched mandatory × 3) + matched optional
```

Mandatory skills are weighted 3× to penalise missing critical requirements more harshly. Returns:
- `mandatoryMatched / mandatoryTotal` — "2/2 Mandatory Skills Matched" displayed in UI
- `matchedSkills` — skills the student HAS (with proficiency level)
- `missingMandatory` / `missingOptional` — gap analysis shown in the detail modal

### 2.4 In-Memory State with localStorage Persistence

`api.ts` maintains a module-level `_state` object:
```
AppState = {
  students, studentSkills, studentDomains,
  applications, history, opportunities, organizations,
  nextApplicationId, nextHistoryId, nextOppId
}
```
- Initialised from `mockDatabase.ts` on first load
- Every mutation calls `setState(updater)` which also writes `JSON.stringify(_state)` to `localStorage['opportunityos_db']`
- `resetDatabase()` clears localStorage and reloads from seed — exposed in sidebar for demos

---

## 3. Database Constraint Enforcement on the Frontend

### 3.1 SQL `CHECK` Constraints → Form Validation

| SQL Constraint | Enforced In |
|---|---|
| `current_year BETWEEN 1 AND 4` | `ProfilePage.validateForm()` |
| `cgpa BETWEEN 0.00 AND 10.00` | `ProfilePage.validateForm()` |
| `min_year <= max_year` | `AdminPage.validateForm()` |
| `deadline >= posted_date` | `AdminPage.validateForm()` |
| `work_mode = 'Remote' OR location_id IS NOT NULL` | `AdminPage.validateForm()` |
| `reward_amount IS NULL = reward_unit IS NULL` | `AdminPage.validateForm()` (both or neither) |
| valid email format | `ProfilePage.validateForm()` (regex) |

### 3.2 `UNIQUE(student_id, opp_id)` — Application Uniqueness

Enforced in `api.ts → createApplication()`:
```typescript
const existing = getState().applications.find(
  a => a.student_id === studentId && a.opp_id === oppId
);
if (existing) throw new Error(`Application already exists (id=${existing.application_id})`);
```
The UI detects this before even showing Apply/Save buttons — each opportunity card checks `existingApp` and renders the current status badge instead.

### 3.3 `application_status_history` Synchronisation

Every status change in `updateApplicationStatus()` does two things atomically in `setState()`:
1. Mutates `applications[idx].status` and `updated_at`
2. Appends a new `ApplicationStatusHistory` row with the new `status`, `changed_at = now`, and the optional `note`

This mirrors the SQL trigger pattern:
```typescript
// Equivalent of: INSERT INTO application_status_history (...) VALUES (...)
const histEntry: ApplicationStatusHistory = {
  history_id: s.nextHistoryId,
  application_id,
  status: newStatus,
  changed_at: now,
  note: note ?? null,
};
```
The Timeline Drawer de-duplicates by `history_id` and sorts by `changed_at` ascending to show a clean audit trail.

---

## 4. Step-by-Step Backend Integration Guide

### 4.1 REST API Endpoints to Build

Map these endpoints to your Node.js / FastAPI / Flask + MySQL backend:

#### Reference Data (Static — can be cached)
```
GET  /api/domains          → SELECT * FROM domains
GET  /api/branches         → SELECT * FROM branches
GET  /api/locations        → SELECT * FROM locations
GET  /api/skills           → SELECT * FROM skills
```

#### Organizations
```
GET  /api/organizations                → SELECT * FROM organizations LEFT JOIN locations ON hq_location_id
POST /api/organizations                → INSERT INTO organizations
```

#### Students
```
GET  /api/students                     → SELECT * FROM students
GET  /api/students/:id                 → SELECT * FROM students WHERE student_id = ?
PATCH /api/students/:id                → UPDATE students SET ... WHERE student_id = ?
GET  /api/students/:id/skills          → SELECT ss.*, s.skill_name, s.domain_id FROM student_skills ss JOIN skills s ...
POST /api/students/:id/skills          → INSERT INTO student_skills (student_id, skill_id, proficiency)
                                          ON DUPLICATE KEY UPDATE proficiency = ?
DELETE /api/students/:id/skills/:skillId → DELETE FROM student_skills WHERE student_id=? AND skill_id=?
GET  /api/students/:id/domains         → SELECT sd.*, d.domain_name FROM student_domains sd JOIN domains d ...
POST /api/students/:id/domains         → INSERT IGNORE INTO student_domains (student_id, domain_id)
DELETE /api/students/:id/domains/:domainId → DELETE FROM student_domains WHERE student_id=? AND domain_id=?
```

#### Opportunities
```
GET  /api/opportunities                → SELECT o.*, org.*, d.domain_name, l.city, l.state ...
                                          FROM opportunities o
                                          JOIN organizations org ON o.org_id = org.org_id
                                          JOIN domains d ON o.domain_id = d.domain_id
                                          LEFT JOIN locations l ON o.location_id = l.location_id
                                          [WHERE filters]
GET  /api/opportunities/:id            → Same with WHERE o.opp_id = ?
POST /api/opportunities                → INSERT INTO opportunities (...)
                                          CHECK: deadline >= posted_date, work_mode logic, reward logic
GET  /api/opportunities/:id/skills     → SELECT os.*, s.skill_name FROM opportunity_skills os JOIN skills s ...
GET  /api/opportunities/:id/branches   → SELECT ob.*, b.branch_name FROM opportunity_branches ob JOIN branches b ...
```

#### Eligibility & Skill Match (can be server-side computed)
```
GET  /api/eligibility?studentId=X&oppId=Y   → Run eligibility checks in SQL
GET  /api/skill-match?studentId=X&oppId=Y   → Run skill match calculation in SQL
```

**Alternative:** Keep eligibility/skill-match on the frontend (as currently) for instant UX. Backend only provides raw data.

#### Applications
```
GET  /api/applications?studentId=X         → SELECT a.*, (full opportunity join) FROM applications a ...
                                               WHERE a.student_id = ?
GET  /api/applications/:id                 → Same with WHERE a.application_id = ?
POST /api/applications                     → INSERT INTO applications (student_id, opp_id, status, created_at, updated_at)
                                               + INSERT INTO application_status_history (...)
                                               -- Enforce UNIQUE(student_id, opp_id) with DB constraint
PATCH /api/applications/:id/status         → BEGIN;
                                               UPDATE applications SET status=?, updated_at=NOW()
                                               WHERE application_id=?;
                                               INSERT INTO application_status_history
                                               (application_id, status, changed_at, note)
                                               VALUES (?, ?, NOW(), ?);
                                               COMMIT;
DELETE /api/applications/:id               → DELETE FROM applications WHERE application_id=?
                                               (CASCADE deletes history rows)
```

#### Dashboard (aggregated)
```
GET  /api/dashboard?studentId=X            → Server-side aggregation of:
                                               - Eligible opportunity count
                                               - Application counts by status
                                               - Top recommended (sorted by skill match)
                                               - Upcoming deadlines
```

### 4.2 Expected JSON Payloads

#### `GET /api/opportunities` response
```json
[
  {
    "opp_id": 1,
    "org_id": 1,
    "domain_id": 1,
    "location_id": 2,
    "title": "ML Engineering Intern",
    "opp_type": "Internship",
    "description": "Work on production ML pipelines...",
    "work_mode": "Hybrid",
    "reward_amount": 15000,
    "reward_unit": "Per month",
    "duration_weeks": 8,
    "posted_date": "2026-06-01",
    "deadline": "2026-11-15",
    "application_url": "https://nimbuslab.io/apply",
    "min_cgpa": 8.0,
    "min_year": 2,
    "max_year": 4,
    "data_source": "Synthetic",
    "organization": { "org_id": 1, "org_name": "Nimbus Labs", "org_type": "Company", ... },
    "domain": { "domain_id": 1, "domain_name": "AI/ML" },
    "location": { "location_id": 2, "city": "Bengaluru", "state": "Karnataka", "country": "India" },
    "skills": [
      { "opp_id": 1, "skill_id": 1, "is_mandatory": true, "skill": { "skill_id": 1, "skill_name": "Python", "domain_id": null } }
    ],
    "branches": [
      { "branch_id": 1, "branch_name": "Computer Science" }
    ]
  }
]
```

#### `POST /api/applications` request body
```json
{ "student_id": 1, "opp_id": 3, "status": "Applied", "note": "Applied via portal" }
```

#### `POST /api/applications` response
```json
{
  "application_id": 11,
  "student_id": 1,
  "opp_id": 3,
  "status": "Applied",
  "created_at": "2026-10-29T10:00:00.000Z",
  "updated_at": "2026-10-29T10:00:00.000Z"
}
```

#### `PATCH /api/applications/:id/status` request body
```json
{ "status": "Shortlisted", "note": "Resume screened and approved" }
```

#### `PATCH /api/applications/:id/status` response
```json
{
  "application_id": 4,
  "status": "Shortlisted",
  "updated_at": "2026-10-29T10:01:00.000Z",
  "history_entry": {
    "history_id": 26,
    "application_id": 4,
    "status": "Shortlisted",
    "changed_at": "2026-10-29T10:01:00.000Z",
    "note": "Resume screened and approved"
  }
}
```

### 4.3 How to Replace Mock Calls with `fetch` in Under 15 Minutes

1. **Add the base URL** — create `.env` in project root:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

2. **Create a thin fetch wrapper** — add `src/services/http.ts`:
   ```typescript
   const BASE = import.meta.env.VITE_API_BASE_URL;

   export async function get<T>(path: string): Promise<T> {
     const res = await fetch(`${BASE}${path}`);
     if (!res.ok) throw new Error(await res.text());
     return res.json();
   }

   export async function post<T>(path: string, body: unknown): Promise<T> {
     const res = await fetch(`${BASE}${path}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(body),
     });
     if (!res.ok) throw new Error(await res.text());
     return res.json();
   }

   export async function patch<T>(path: string, body: unknown): Promise<T> {
     const res = await fetch(`${BASE}${path}`, {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(body),
     });
     if (!res.ok) throw new Error(await res.text());
     return res.json();
   }

   export async function del(path: string): Promise<void> {
     const res = await fetch(`${BASE}${path}`, { method: 'DELETE' });
     if (!res.ok) throw new Error(await res.text());
   }
   ```

3. **Swap each function** — example for the most critical ones:

   **Before (mock):**
   ```typescript
   export async function getOpportunities(filters?: {...}): Promise<EnrichedOpportunity[]> {
     await delay();
     let opps = getState().opportunities;
     // ... filter logic ...
     return opps.map(enrichOpportunity);
   }
   ```

   **After (real backend):**
   ```typescript
   import { get } from './http';

   export async function getOpportunities(filters?: {...}): Promise<EnrichedOpportunity[]> {
     const params = new URLSearchParams();
     if (filters?.domainId) params.set('domainId', String(filters.domainId));
     if (filters?.oppType) params.set('oppType', filters.oppType);
     if (filters?.workMode) params.set('workMode', filters.workMode);
     if (filters?.search) params.set('search', filters.search);
     return get<EnrichedOpportunity[]>(`/opportunities?${params}`);
   }
   ```

   **`createApplication` swap:**
   ```typescript
   export async function createApplication(studentId, oppId, status, note?) {
     return post<Application>('/applications', { student_id: studentId, opp_id: oppId, status, note });
   }
   ```

   **`updateApplicationStatus` swap:**
   ```typescript
   export async function updateApplicationStatus(applicationId, newStatus, note?) {
     return patch<Application>(`/applications/${applicationId}/status`, { status: newStatus, note });
   }
   ```

4. **Zero UI changes required** — all 6 pages only import from `api.ts`. No page file needs editing.

### 4.4 Authentication Headers (when adding auth later)

Extend `http.ts` to read a JWT from localStorage:
```typescript
const headers = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token') && {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }),
});
```

---

## 5. Component Architecture Map

```
App.tsx
└─ AppProvider (context)
   └─ BrowserRouter
      └─ Layout (sidebar + outlet)
         ├─ NavLink × 6
         ├─ Student Switcher (reads AppContext)
         ├─ ToastContainer (reads AppContext)
         └─ <Outlet /> — one of:
            ├─ DashboardPage      → api.getDashboardStats(studentId)
            ├─ OpportunitiesPage  → api.getOpportunities() + checkEligibilityBatch + calculateSkillMatch
            ├─ ApplicationsPage   → api.getApplicationsForStudent(studentId)
            ├─ ProfilePage        → api.getStudentSkills + updateStudent + addStudentSkill
            ├─ OrganizationsPage  → api.getOrganizations()
            └─ AdminPage          → api.getOpportunities() + createOpportunity()
```

### Reusable Components (`src/components/ui/index.tsx`)

| Component | Props | Used In |
|---|---|---|
| `Badge` | `children, className` | All pages |
| `Button` | `variant, size, loading, disabled` | All pages |
| `Card` | HTML div props | All pages |
| `Input` | `label, error, helpText` + input props | Profile, Admin |
| `Select` | `label, error, options, placeholder` + select props | Profile, Admin, Applications |
| `Textarea` | `label, error` + textarea props | Applications, Admin |
| `Modal` | `isOpen, onClose, title, size` | Opportunities, Applications, Admin |
| `ProgressBar` | `value, max, color` | Dashboard, Opportunities |
| `EmptyState` | `icon, title, description, action` | Opportunities, Applications |
| `Spinner` | `className` | All data-loading pages |
| `KpiCard` | `title, value, subtitle, icon, iconBg, trend` | Dashboard |
| `Toggle` | `checked, onChange, label` | Opportunities filter bar |

---

## 6. Performance Considerations

- **Batch eligibility checks** — `checkEligibilityBatch` uses `Promise.all` to fire all 15 eligibility computations in parallel, completing in ~1 async tick
- **Optimistic UI** — apply/save buttons show loading state immediately; data re-fetches after mutation completes
- **Lazy eligibility computing** — the Opportunities page first renders all cards (fast), then overlays eligibility dots after the batch completes (progressive enhancement)
- **LocalStorage persistence** — eliminates re-seeding on page refresh during demos

---

## 7. Key Design Decisions & Trade-offs

| Decision | Rationale |
|---|---|
| No Redux / Zustand | AppContext is sufficient for this scope; avoids boilerplate |
| Single `api.ts` file | One file = one place to swap — no scattered fetch calls across components |
| `mockDatabase.ts` is read-only | Mutations only via `api.ts` state layer; data layer integrity preserved |
| Eligibility computed on frontend | Instant UX; no round-trip needed for read-only rule evaluation |
| Status history appended, never edited | Matches the audit-log semantic of the SQL table exactly |
| `window.location.reload()` on profile save | Simplest way to sync the AppContext student object after a mutation without complex state invalidation |
