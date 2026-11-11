// ============================================================
// Admin Panel — Post New Opportunity + Data Explorer
// ============================================================
import React, { useState, useEffect } from 'react';
import { Plus, Database, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';
import type { Opportunity, OppType, WorkMode, RewardUnit } from '../types/database';
import {
  Card, Button, Input, Select, Textarea, Modal, Badge, Spinner,
} from '../components/ui';
import { oppTypeConfig, workModeConfig, formatDate, formatReward } from '../utils/helpers';
import { domains, locations } from '../data/mockDatabase';

type NewOppForm = {
  org_id: string; domain_id: string; location_id: string;
  title: string; opp_type: OppType | ''; description: string;
  work_mode: WorkMode | ''; reward_amount: string; reward_unit: RewardUnit | '';
  duration_weeks: string; posted_date: string; deadline: string;
  application_url: string; min_cgpa: string; min_year: string; max_year: string;
};

const defaultForm: NewOppForm = {
  org_id: '', domain_id: '', location_id: '',
  title: '', opp_type: '', description: '',
  work_mode: '', reward_amount: '', reward_unit: '',
  duration_weeks: '', posted_date: new Date().toISOString().split('T')[0],
  deadline: '', application_url: '',
  min_cgpa: '0', min_year: '1', max_year: '4',
};

export function AdminPage() {
  const { showToast } = useAppContext();
  const [opps, setOpps] = useState<Awaited<ReturnType<typeof api.getOpportunities>>>([]);
  const [orgs, setOrgs] = useState<Awaited<ReturnType<typeof api.getOrganizations>>>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewOppForm>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [o, orgs] = await Promise.all([api.getOpportunities(), api.getOrganizations()]);
    setOpps(o);
    setOrgs(orgs);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.org_id) e.org_id = 'Organization is required';
    if (!form.domain_id) e.domain_id = 'Domain is required';
    if (!form.opp_type) e.opp_type = 'Type is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.work_mode) e.work_mode = 'Work mode is required';
    if (!form.posted_date) e.posted_date = 'Posted date is required';
    if (!form.deadline) e.deadline = 'Deadline is required';
    if (form.posted_date && form.deadline && form.deadline < form.posted_date) {
      e.deadline = 'Deadline must be ≥ Posted date';
    }
    // work_mode !== Remote requires location
    if (form.work_mode && form.work_mode !== 'Remote' && !form.location_id) {
      e.location_id = 'Location required for Onsite/Hybrid';
    }
    // reward: both or neither
    const hasAmount = form.reward_amount !== '';
    const hasUnit = form.reward_unit !== '';
    if (hasAmount !== hasUnit) e.reward_amount = 'Reward amount and unit must both be set or both be empty';
    // min_year <= max_year
    if (Number(form.min_year) > Number(form.max_year)) e.min_year = 'Min year must be ≤ max year';
    if (!form.application_url.startsWith('http')) e.application_url = 'Must be a valid URL';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const data: Omit<Opportunity, 'opp_id'> = {
        org_id: Number(form.org_id),
        domain_id: Number(form.domain_id),
        location_id: form.location_id ? Number(form.location_id) : null,
        title: form.title,
        opp_type: form.opp_type as OppType,
        description: form.description,
        work_mode: form.work_mode as WorkMode,
        reward_amount: form.reward_amount ? Number(form.reward_amount) : null,
        reward_unit: form.reward_unit || null,
        duration_weeks: form.duration_weeks ? Number(form.duration_weeks) : null,
        posted_date: form.posted_date,
        deadline: form.deadline,
        application_url: form.application_url,
        min_cgpa: Number(form.min_cgpa),
        min_year: Number(form.min_year) as 1|2|3|4,
        max_year: Number(form.max_year) as 1|2|3|4,
        data_source: 'Synthetic',
      };
      await api.createOpportunity(data);
      showToast(`Opportunity "${form.title}" posted successfully!`, 'success');
      setForm(defaultForm);
      setShowModal(false);
      await loadData();
    } catch (e: any) {
      showToast(e.message, 'error');
    }
    setSubmitting(false);
  };

  const f = (k: keyof NewOppForm) => form[k];
  const set = (k: keyof NewOppForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-600" /> Admin Panel
          </h1>
          <p className="text-slate-500 mt-1">Data management and opportunity administration</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Post Opportunity
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Opportunities', value: opps.length, icon: '🎯' },
          { label: 'Organizations', value: orgs.length, icon: '🏢' },
          { label: 'Active (not expired)', value: opps.filter(o => new Date(o.deadline) >= new Date()).length, icon: '✅' },
          { label: 'Domains', value: domains.length, icon: '📂' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Opportunities table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-700">All Opportunities</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['ID','Title','Org','Type','Mode','Reward','Deadline','Year','CGPA'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {opps.map(opp => {
                  const expired = new Date(opp.deadline) < new Date();
                  return (
                    <tr key={opp.opp_id} className={`hover:bg-slate-50/50 ${expired ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">#{opp.opp_id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 whitespace-nowrap">{opp.title}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{opp.organization.org_name}</td>
                      <td className="px-4 py-3">
                        <Badge className={`${oppTypeConfig[opp.opp_type].bg} ${oppTypeConfig[opp.opp_type].color} whitespace-nowrap`}>
                          {opp.opp_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${workModeConfig[opp.work_mode].bg} ${workModeConfig[opp.work_mode].color}`}>
                          {opp.work_mode}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                        {formatReward(opp.reward_amount, opp.reward_unit)}
                      </td>
                      <td className={`px-4 py-3 text-xs whitespace-nowrap ${expired ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                        {formatDate(opp.deadline)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">Yr {opp.min_year}–{opp.max_year}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">≥{opp.min_cgpa}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Post Opportunity Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post New Opportunity" size="2xl">
        <div className="space-y-4">
          {/* Constraint reminder */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>All DB constraints are enforced: deadline ≥ posted date, location required for Onsite/Hybrid, reward amount &amp; unit both set or both empty, min_year ≤ max_year.</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={f('title')} onChange={set('title')} error={errors.title} />
            <Select
              label="Organization" value={f('org_id')} onChange={set('org_id')}
              options={orgs.map(o => ({ value: o.org_id, label: o.org_name }))}
              placeholder="Select org…" error={errors.org_id}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Domain" value={f('domain_id')} onChange={set('domain_id')}
              options={domains.map(d => ({ value: d.domain_id, label: d.domain_name }))}
              placeholder="Select domain…" error={errors.domain_id}
            />
            <Select
              label="Type" value={f('opp_type')} onChange={set('opp_type')}
              options={(['Internship','Research','Hackathon','Competition','Scholarship'] as OppType[]).map(t => ({ value: t, label: t }))}
              placeholder="Select type…" error={errors.opp_type}
            />
          </div>
          <Textarea label="Description" value={f('description')} onChange={set('description')} rows={3} error={errors.description} />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Work Mode" value={f('work_mode')} onChange={set('work_mode')}
              options={(['Remote','Onsite','Hybrid'] as WorkMode[]).map(m => ({ value: m, label: m }))}
              placeholder="Select mode…" error={errors.work_mode}
            />
            <Select
              label="Location (required for Onsite/Hybrid)" value={f('location_id')} onChange={set('location_id')}
              options={locations.map(l => ({ value: l.location_id, label: `${l.city}, ${l.state}` }))}
              placeholder="Remote / Not applicable"
              error={errors.location_id}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Reward Amount (₹)" type="number" value={f('reward_amount')} onChange={set('reward_amount')} error={errors.reward_amount} />
            <Select
              label="Reward Unit" value={f('reward_unit')} onChange={set('reward_unit')}
              options={[{ value: 'Per month', label: 'Per month' }, { value: 'One time', label: 'One time' }]}
              placeholder="—"
            />
            <Input label="Duration (weeks)" type="number" value={f('duration_weeks')} onChange={set('duration_weeks')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Posted Date" type="date" value={f('posted_date')} onChange={set('posted_date')} />
            <Input label="Deadline" type="date" value={f('deadline')} onChange={set('deadline')} error={errors.deadline} />
          </div>
          <Input label="Application URL" type="url" value={f('application_url')} onChange={set('application_url')} error={errors.application_url} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Min CGPA (0–10)" type="number" min="0" max="10" step="0.1" value={f('min_cgpa')} onChange={set('min_cgpa')} />
            <Select
              label="Min Year" value={f('min_year')} onChange={set('min_year')}
              options={[1,2,3,4].map(y => ({ value: y, label: `Year ${y}` }))}
              error={errors.min_year}
            />
            <Select
              label="Max Year" value={f('max_year')} onChange={set('max_year')}
              options={[1,2,3,4].map(y => ({ value: y, label: `Year ${y}` }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit} className="flex-1">
              <CheckCircle2 className="w-4 h-4" /> Post Opportunity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
