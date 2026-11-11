// ============================================================
// Profile & Skill Matrix Manager Page
// ============================================================
import { useEffect, useState } from 'react';
import { User, Plus, X, BookOpen, Pencil, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';
import type { Student, Proficiency } from '../types/database';
import {
  Card, Button, Input, Select, Spinner,
} from '../components/ui';
import { domains, skills, branches } from '../data/mockDatabase';

export function ProfilePage() {
  const { activeStudentId, activeStudent, showToast } = useAppContext();
  const [studentSkills, setStudentSkills] = useState<Array<{ skill_id: number; skill_name: string; proficiency: Proficiency }>>([]);
  const [studentDomainIds, setStudentDomainIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [form, setForm] = useState<Partial<Student>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Skill add state
  const [addSkillId, setAddSkillId] = useState('');
  const [addProficiency, setAddProficiency] = useState<Proficiency>('Beginner');
  const [addingSkill, setAddingSkill] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [sk, sd] = await Promise.all([
      api.getStudentSkills(activeStudentId),
      api.getStudentDomains(activeStudentId),
    ]);
    setStudentSkills(sk.map(s => ({ skill_id: s.skill_id, skill_name: s.skill.skill_name, proficiency: s.proficiency })));
    setStudentDomainIds(sd.map(d => d.domain_id));
    setLoading(false);
  };

  useEffect(() => {
    if (activeStudent) {
      setForm({
        full_name: activeStudent.full_name,
        email: activeStudent.email,
        college_name: activeStudent.college_name,
        branch_id: activeStudent.branch_id,
        current_year: activeStudent.current_year,
        cgpa: activeStudent.cgpa,
        preferred_work_mode: activeStudent.preferred_work_mode,
      });
    }
    loadData();
  }, [activeStudentId, activeStudent]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.full_name?.trim()) errors.full_name = 'Name is required';
    if (!form.email?.match(/^[^@]+@[^@]+\.[^@]+$/)) errors.email = 'Valid email required';
    if (!form.current_year || form.current_year < 1 || form.current_year > 4) errors.current_year = 'Year must be 1–4';
    if (form.cgpa === undefined || form.cgpa < 0 || form.cgpa > 10) errors.cgpa = 'CGPA must be 0.00–10.00';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    setSaving(true);
    await api.updateStudent(activeStudentId, form);
    showToast('Profile updated successfully!', 'success');
    setSaving(false);
    setEditMode(false);
    window.location.reload();
  };

  const handleAddSkill = async () => {
    if (!addSkillId) return;
    setAddingSkill(true);
    await api.addStudentSkill(activeStudentId, Number(addSkillId), addProficiency);
    showToast('Skill added!', 'success');
    setAddSkillId('');
    await loadData();
    setAddingSkill(false);
  };

  const handleRemoveSkill = async (skillId: number) => {
    await api.removeStudentSkill(activeStudentId, skillId);
    showToast('Skill removed', 'info');
    await loadData();
  };

  const handleToggleDomain = async (domainId: number) => {
    if (studentDomainIds.includes(domainId)) {
      await api.removeStudentDomain(activeStudentId, domainId);
    } else {
      await api.addStudentDomain(activeStudentId, domainId);
    }
    await loadData();
  };

  const availableSkillsToAdd = skills.filter(s => !studentSkills.some(ss => ss.skill_id === s.skill_id));
  const branchName = branches.find(b => b.branch_id === activeStudent?.branch_id)?.branch_name ?? '—';

  if (loading || !activeStudent) {
    return <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile & Skills</h1>
          <p className="text-slate-500 mt-1">Manage your academic profile and skill matrix</p>
        </div>
        {!editMode ? (
          <Button variant="secondary" onClick={() => setEditMode(true)}>
            <Pencil className="w-4 h-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleSaveProfile}>
              <CheckCircle className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-3 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
              {activeStudent.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activeStudent.full_name}</h2>
              <p className="text-sm text-slate-500">{activeStudent.college_name}</p>
              <p className="text-xs text-slate-400">{branchName} · Year {activeStudent.current_year} · CGPA {activeStudent.cgpa}</p>
            </div>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={form.full_name ?? ''}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                error={formErrors.full_name}
              />
              <Input
                label="Email"
                type="email"
                value={form.email ?? ''}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={formErrors.email}
              />
              <Input
                label="College Name"
                value={form.college_name ?? ''}
                onChange={e => setForm(f => ({ ...f, college_name: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Branch"
                  value={form.branch_id ?? ''}
                  onChange={e => setForm(f => ({ ...f, branch_id: Number(e.target.value) }))}
                  options={branches.map(b => ({ value: b.branch_id, label: b.branch_name }))}
                />
                <Select
                  label="Current Year"
                  value={form.current_year ?? ''}
                  onChange={e => setForm(f => ({ ...f, current_year: Number(e.target.value) as 1|2|3|4 }))}
                  options={[1,2,3,4].map(y => ({ value: y, label: `Year ${y}` }))}
                  error={formErrors.current_year}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CGPA (0.00–10.00)"
                  type="number" min="0" max="10" step="0.01"
                  value={form.cgpa ?? ''}
                  onChange={e => setForm(f => ({ ...f, cgpa: parseFloat(e.target.value) }))}
                  error={formErrors.cgpa}
                />
                <Select
                  label="Preferred Work Mode"
                  value={form.preferred_work_mode ?? ''}
                  onChange={e => setForm(f => ({ ...f, preferred_work_mode: e.target.value as Student['preferred_work_mode'] }))}
                  options={['Remote','Onsite','Hybrid','Any'].map(m => ({ value: m, label: m }))}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Email', activeStudent.email],
                ['Branch', branchName],
                ['Year', `Year ${activeStudent.current_year}`],
                ['CGPA', activeStudent.cgpa.toFixed(2)],
                ['Work Preference', activeStudent.preferred_work_mode],
                ['College', activeStudent.college_name],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-slate-400">{k}</p>
                  <p className="font-medium text-slate-800">{v}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Interests / Domains */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Interest Domains
            </h3>
            <div className="flex flex-wrap gap-2">
              {domains.map(d => {
                const active = studentDomainIds.includes(d.domain_id);
                return (
                  <button
                    key={d.domain_id}
                    onClick={() => handleToggleDomain(d.domain_id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {d.domain_name}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Quick Stats</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Skills listed</span><span className="font-bold text-slate-900">{studentSkills.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Domains of interest</span><span className="font-bold text-slate-900">{studentDomainIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Advanced skills</span>
                <span className="font-bold text-emerald-700">
                  {studentSkills.filter(s => s.proficiency === 'Advanced').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Skill Matrix */}
      <Card className="p-6 mt-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" /> Skill Matrix
        </h3>

        {/* Add skill row */}
        <div className="flex gap-3 mb-5">
          <select
            value={addSkillId}
            onChange={e => setAddSkillId(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select skill to add…</option>
            {availableSkillsToAdd.map(s => (
              <option key={s.skill_id} value={s.skill_id}>{s.skill_name}</option>
            ))}
          </select>
          <select
            value={addProficiency}
            onChange={e => setAddProficiency(e.target.value as Proficiency)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {(['Beginner','Intermediate','Advanced'] as Proficiency[]).map(p =>
              <option key={p} value={p}>{p}</option>
            )}
          </select>
          <Button variant="primary" onClick={handleAddSkill} loading={addingSkill} disabled={!addSkillId}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        {/* Skill list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {studentSkills.map(sk => {
            const profColors = {
              Beginner:     { bg: 'bg-slate-100',    text: 'text-slate-600', bar: 'bg-slate-400',   width: 'w-1/3' },
              Intermediate: { bg: 'bg-amber-50',     text: 'text-amber-700', bar: 'bg-amber-400',   width: 'w-2/3' },
              Advanced:     { bg: 'bg-emerald-50',   text: 'text-emerald-700', bar: 'bg-emerald-500', width: 'w-full' },
            }[sk.proficiency];
            return (
              <div key={sk.skill_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-800">{sk.skill_name}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${profColors.bg} ${profColors.text}`}>
                      {sk.proficiency}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full">
                    <div className={`h-full rounded-full ${profColors.bar} ${profColors.width}`} />
                  </div>
                </div>
                <button onClick={() => handleRemoveSkill(sk.skill_id)}
                  className="text-slate-300 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
        {studentSkills.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-4">No skills added yet. Add skills to improve your match scores!</p>
        )}
      </Card>
    </div>
  );
}
