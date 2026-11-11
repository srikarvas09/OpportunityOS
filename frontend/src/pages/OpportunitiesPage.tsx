// ============================================================
// Opportunities Page — Explorer + Eligibility Engine
// ============================================================
import { useEffect, useState, useMemo } from 'react';
import {
  Search, MapPin, DollarSign, Clock, ExternalLink,
  CheckCircle2, XCircle, BookmarkPlus, Send,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';
import type { EnrichedOpportunity, EligibilityResult, SkillMatchResult, OppType, WorkMode } from '../types/database';
import {
  Card, Badge, Button, Modal, ProgressBar, Spinner, EmptyState, Toggle,
} from '../components/ui';
import {
  formatDate, formatReward, daysUntil, isExpired,
  oppTypeConfig, workModeConfig,
} from '../utils/helpers';
import { domains } from '../data/mockDatabase';

interface OppWithMeta extends EnrichedOpportunity {
  eligibility?: EligibilityResult;
  skillMatch?: SkillMatchResult;
  existingApp?: { status: string } | null;
}

export function OpportunitiesPage() {
  const { activeStudentId, showToast } = useAppContext();
  const [opps, setOpps] = useState<OppWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<OppWithMeta | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const loadOpps = async () => {
    setLoading(true);
    const allOpps = await api.getOpportunities();
    setOpps(allOpps.map(o => ({ ...o })));
    setLoading(false);

    // Compute eligibility + skill match in background
    setComputing(true);
    const [eligibilityResults, skillMatchResults, apps] = await Promise.all([
      api.checkEligibilityBatch(activeStudentId, allOpps.map(o => o.opp_id)),
      Promise.all(allOpps.map(o => api.calculateSkillMatch(activeStudentId, o.opp_id))),
      api.getApplicationsForStudent(activeStudentId),
    ]);
    const appMap = new Map(apps.map(a => [a.opp_id, a]));
    setOpps(allOpps.map((o, i) => ({
      ...o,
      eligibility: eligibilityResults[i],
      skillMatch: skillMatchResults[i],
      existingApp: appMap.get(o.opp_id) ?? null,
    })));
    setComputing(false);
  };

  useEffect(() => { loadOpps(); }, [activeStudentId]);

  // Apply filter
  const filtered = useMemo(() => {
    let list = opps;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => o.title.toLowerCase().includes(q) || o.organization.org_name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
    }
    if (filterDomain) list = list.filter(o => o.domain_id === Number(filterDomain));
    if (filterType) list = list.filter(o => o.opp_type === filterType);
    if (filterMode) list = list.filter(o => o.work_mode === filterMode);
    if (eligibleOnly) list = list.filter(o => o.eligibility?.isEligible);
    return list;
  }, [opps, search, filterDomain, filterType, filterMode, eligibleOnly]);

  const handleApply = async (opp: OppWithMeta, status: 'Saved' | 'Applied') => {
    setApplyingId(opp.opp_id);
    try {
      await api.createApplication(activeStudentId, opp.opp_id, status);
      showToast(status === 'Saved' ? `Saved "${opp.title}"` : `Applied to "${opp.title}"!`, 'success');
      await loadOpps();
      if (selectedOpp?.opp_id === opp.opp_id) {
        setSelectedOpp(prev => prev ? { ...prev, existingApp: { status } } : null);
      }
    } catch (e: unknown) {
      showToast((e as Error).message, 'error');
    }
    setApplyingId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Opportunity Explorer</h1>
        <p className="text-slate-500 mt-1">
          {filtered.length} opportunities {computing ? '(computing eligibility…)' : ''}
        </p>
      </div>

      {/* Search + Filters Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search opportunities, companies…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Domains</option>
          {domains.map(d => <option key={d.domain_id} value={d.domain_id}>{d.domain_name}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Types</option>
          {(['Internship','Research','Hackathon','Competition','Scholarship'] as OppType[]).map(t =>
            <option key={t} value={t}>{t}</option>
          )}
        </select>
        <select value={filterMode} onChange={e => setFilterMode(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Work Modes</option>
          {(['Remote','Onsite','Hybrid'] as WorkMode[]).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <Toggle checked={eligibleOnly} onChange={setEligibleOnly} label="Eligible Only" />
      </div>

      {/* Opportunity Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No opportunities match your filters" description="Try adjusting or removing some filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(opp => (
            <OppCard
              key={opp.opp_id}
              opp={opp}
              computing={computing}
              applyingId={applyingId}
              onOpen={() => setSelectedOpp(opp)}
              onSave={() => handleApply(opp, 'Saved')}
              onApply={() => handleApply(opp, 'Applied')}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOpp && (
        <OppDetailModal
          opp={selectedOpp}
          onClose={() => setSelectedOpp(null)}
          applyingId={applyingId}
          onSave={() => handleApply(selectedOpp, 'Saved')}
          onApply={() => handleApply(selectedOpp, 'Applied')}
        />
      )}
    </div>
  );
}

// ── Opportunity Card ──────────────────────────────────────────
function OppCard({ opp, computing, applyingId, onOpen, onSave, onApply }: {
  opp: OppWithMeta; computing: boolean; applyingId: number | null;
  onOpen: () => void; onSave: () => void; onApply: () => void;
}) {
  const expired = isExpired(opp.deadline);
  const days = daysUntil(opp.deadline);
  const typeConf = oppTypeConfig[opp.opp_type];
  const modeConf = workModeConfig[opp.work_mode];
  const eligible = opp.eligibility?.isEligible;
  const matchScore = opp.skillMatch?.matchScore;

  return (
    <Card className={`p-4 flex flex-col gap-3 hover:shadow-md transition-shadow ${expired ? 'opacity-70' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge className={`${typeConf.bg} ${typeConf.color}`}>{opp.opp_type}</Badge>
            <Badge className={`${modeConf.bg} ${modeConf.color}`}>{opp.work_mode}</Badge>
            {expired && <Badge className="bg-red-100 text-red-600">CLOSED</Badge>}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">{opp.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{opp.organization.org_name}</p>
        </div>
        {/* Eligibility dot */}
        {opp.eligibility && (
          <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${eligible ? 'bg-emerald-400' : 'bg-red-400'}`}
            title={eligible ? 'Eligible' : 'Not eligible'} />
        )}
        {computing && !opp.eligibility && (
          <div className="w-2.5 h-2.5 rounded-full mt-1 bg-slate-200 animate-pulse shrink-0" />
        )}
      </div>

      {/* Info row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
        {opp.location && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opp.location.city}</span>
        )}
        {opp.duration_weeks && (
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{opp.duration_weeks}w</span>
        )}
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />{formatReward(opp.reward_amount, opp.reward_unit)}
        </span>
      </div>

      {/* Skill match bar */}
      {matchScore !== undefined && (
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Skill Match</span>
            <span className="font-medium">{matchScore}%</span>
          </div>
          <ProgressBar
            value={matchScore}
            color={matchScore >= 70 ? 'bg-emerald-500' : matchScore >= 40 ? 'bg-amber-400' : 'bg-red-400'}
          />
        </div>
      )}

      {/* Deadline */}
      <div className={`text-xs ${expired ? 'text-red-500 font-medium' : days <= 7 ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
        {expired ? '⛔ Closed' : `⏰ ${days}d left — Due ${formatDate(opp.deadline)}`}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-slate-50">
        <Button variant="ghost" size="sm" className="flex-1" onClick={onOpen}>Details</Button>
        {opp.existingApp ? (
          <Badge className="px-3 py-1 bg-slate-100 text-slate-600 text-xs">
            {opp.existingApp.status}
          </Badge>
        ) : expired ? null : (
          <>
            <Button variant="secondary" size="sm" loading={applyingId === opp.opp_id} onClick={onSave}>
              <BookmarkPlus className="w-3 h-3" />
            </Button>
            <Button variant="primary" size="sm" loading={applyingId === opp.opp_id} onClick={onApply}>
              <Send className="w-3 h-3" /> Apply
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

// ── Opportunity Detail Modal ─────────────────────────────────
function OppDetailModal({ opp, onClose, applyingId, onSave, onApply }: {
  opp: OppWithMeta; onClose: () => void; applyingId: number | null;
  onSave: () => void; onApply: () => void;
}) {
  const expired = isExpired(opp.deadline);
  const { eligibility: elig, skillMatch: sm } = opp;

  return (
    <Modal isOpen={true} onClose={onClose} title={opp.title} size="2xl">
      <div className="space-y-5">
        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <Badge className={`${oppTypeConfig[opp.opp_type].bg} ${oppTypeConfig[opp.opp_type].color}`}>{opp.opp_type}</Badge>
          <Badge className={`${workModeConfig[opp.work_mode].bg} ${workModeConfig[opp.work_mode].color}`}>{opp.work_mode}</Badge>
          {expired && <Badge className="bg-red-100 text-red-600">CLOSED</Badge>}
          <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />
            {opp.location ? `${opp.location.city}, ${opp.location.state}` : 'Remote / Any'}
          </span>
        </div>

        {/* Org + description */}
        <div>
          <p className="text-sm font-semibold text-slate-700">{opp.organization.org_name}
            <span className="ml-2 text-xs font-normal text-slate-400">({opp.organization.org_type})</span>
          </p>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{opp.description}</p>
        </div>

        {/* Reward + Duration + Dates */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-0.5">Reward</p>
            <p className="font-semibold text-slate-800">{formatReward(opp.reward_amount, opp.reward_unit)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-0.5">Duration</p>
            <p className="font-semibold text-slate-800">{opp.duration_weeks ? `${opp.duration_weeks} weeks` : 'Flexible'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-0.5">Posted</p>
            <p className="font-semibold text-slate-800">{formatDate(opp.posted_date)}</p>
          </div>
          <div className={`rounded-lg p-3 ${expired ? 'bg-red-50' : 'bg-slate-50'}`}>
            <p className="text-xs text-slate-400 mb-0.5">Deadline</p>
            <p className={`font-semibold ${expired ? 'text-red-600' : 'text-slate-800'}`}>{formatDate(opp.deadline)}</p>
          </div>
        </div>

        {/* Eligibility Breakdown */}
        {elig && (
          <div className="border border-slate-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              {elig.isEligible
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                : <XCircle className="w-4 h-4 text-red-500" />}
              <h3 className="text-sm font-semibold text-slate-800">
                {elig.isEligible ? 'You are eligible!' : 'Not eligible'}
              </h3>
            </div>
            <div className="space-y-2">
              <EligCheck
                label="CGPA Check"
                pass={elig.cgpaCheck.pass}
                detail={`Your CGPA ${elig.cgpaCheck.studentCgpa} ${elig.cgpaCheck.pass ? '≥' : '<'} Required ${elig.cgpaCheck.required}`}
              />
              <EligCheck
                label="Year Check"
                pass={elig.yearCheck.pass}
                detail={`Year ${elig.yearCheck.studentYear} • Allowed: Yr ${elig.yearCheck.minYear}–${elig.yearCheck.maxYear}`}
              />
              <EligCheck
                label="Branch Check"
                pass={elig.branchCheck.pass}
                detail={elig.branchCheck.openToAll ? 'Open to all branches' :
                  `Your branch ${elig.branchCheck.pass ? 'is' : 'is NOT'} in allowed list`}
              />
            </div>
          </div>
        )}

        {/* Skill Match */}
        {sm && (
          <div className="border border-slate-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Skill Match Analysis</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-indigo-700">{sm.matchScore}%</span>
                <ProgressBar value={sm.matchScore} className="w-24"
                  color={sm.matchScore >= 70 ? 'bg-emerald-500' : sm.matchScore >= 40 ? 'bg-amber-400' : 'bg-red-400'} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-3">
              <div>
                <p className="font-medium text-slate-700 mb-1">✅ Mandatory: {sm.mandatoryMatched}/{sm.mandatoryTotal} matched</p>
                <p>Optional: {sm.optionalMatched}/{sm.optionalTotal} matched</p>
              </div>
            </div>
            {sm.matchedSkills.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-slate-500 mb-1.5">You have:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sm.matchedSkills.map(ms => (
                    <span key={ms.skill.skill_id}
                      className={`text-xs px-2 py-0.5 rounded-full ${ms.is_mandatory ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                      {ms.skill.skill_name} · {ms.proficiency}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {sm.missingMandatory.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-1.5">Missing mandatory:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sm.missingMandatory.map(sk => (
                    <span key={sk.skill_id} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">{sk.skill_name}</span>
                  ))}
                </div>
              </div>
            )}
            {sm.missingOptional.length > 0 && (
              <div className="mt-1.5">
                <p className="text-xs font-medium text-slate-400 mb-1.5">Missing optional:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sm.missingOptional.map(sk => (
                    <span key={sk.skill_id} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{sk.skill_name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <a href={opp.application_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
            <ExternalLink className="w-4 h-4" /> External Link
          </a>
          <div className="flex-1" />
          {opp.existingApp ? (
            <Badge className="px-4 py-2 bg-slate-100 text-slate-700 text-sm">
              {opp.existingApp.status}
            </Badge>
          ) : expired ? (
            <Badge className="px-4 py-2 bg-red-100 text-red-600">Deadline Closed</Badge>
          ) : (
            <>
              <Button variant="secondary" loading={applyingId === opp.opp_id} onClick={onSave}>
                <BookmarkPlus className="w-4 h-4" /> Save
              </Button>
              <Button variant="primary" loading={applyingId === opp.opp_id} onClick={onApply}>
                <Send className="w-4 h-4" /> Apply Now
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

function EligCheck({ label, pass, detail }: { label: string; pass: boolean; detail: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {pass
        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
      <span className="font-medium text-slate-700 w-24 shrink-0">{label}</span>
      <span className="text-slate-500">{detail}</span>
    </div>
  );
}
