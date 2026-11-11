// ============================================================
// Applications Page — Kanban + Table View + Timeline Drawer
// ============================================================
import { useEffect, useState } from 'react';
import {
  Columns, List, Clock, ArrowRight, Trash2,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';
import type { EnrichedApplication, ApplicationStatus } from '../types/database';
import {
  Card, Badge, Button, Modal, Textarea, Select, Spinner, EmptyState,
} from '../components/ui';
import { formatDate, formatDateTime, statusConfig, KANBAN_COLUMNS, ALL_STATUSES, oppTypeConfig, cn } from '../utils/helpers';

export function ApplicationsPage() {
  const { activeStudentId, showToast } = useAppContext();
  const [apps, setApps] = useState<EnrichedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [timelineApp, setTimelineApp] = useState<EnrichedApplication | null>(null);
  const [statusModalApp, setStatusModalApp] = useState<EnrichedApplication | null>(null);

  const loadApps = async () => {
    setLoading(true);
    const data = await api.getApplicationsForStudent(activeStudentId);
    setApps(data);
    setLoading(false);
  };

  useEffect(() => { loadApps(); }, [activeStudentId]);

  const openTimeline = (app: EnrichedApplication) => setTimelineApp(app);
  const openStatusModal = (app: EnrichedApplication) => setStatusModalApp(app);

  const handleDelete = async (app: EnrichedApplication) => {
    if (!confirm(`Remove application for "${app.opportunity.title}"?`)) return;
    await api.deleteApplication(app.application_id);
    showToast('Application removed', 'info');
    await loadApps();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 mt-1">{apps.length} total application records</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView('kanban')}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              view === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}
          >
            <Columns className="w-4 h-4" /> Kanban
          </button>
          <button
            onClick={() => setView('table')}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              view === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}
          >
            <List className="w-4 h-4" /> Table
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>
      ) : apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Visit the Opportunity Explorer to discover and apply to opportunities."
        />
      ) : view === 'kanban' ? (
        <KanbanView
          apps={apps}
          onTimeline={openTimeline}
          onStatusChange={openStatusModal}
          onDelete={handleDelete}
        />
      ) : (
        <TableView
          apps={apps}
          onTimeline={openTimeline}
          onStatusChange={openStatusModal}
          onDelete={handleDelete}
        />
      )}

      {/* Timeline Drawer */}
      {timelineApp && (
        <TimelineModal app={timelineApp} onClose={() => setTimelineApp(null)} />
      )}

      {/* Status Update Modal */}
      {statusModalApp && (
        <StatusUpdateModal
          app={statusModalApp}
          onClose={() => setStatusModalApp(null)}
          onUpdated={async () => { await loadApps(); setStatusModalApp(null); }}
        />
      )}
    </div>
  );
}

// ── Kanban Board ──────────────────────────────────────────────
function KanbanView({ apps, onTimeline, onStatusChange, onDelete }: {
  apps: EnrichedApplication[];
  onTimeline: (a: EnrichedApplication) => void;
  onStatusChange: (a: EnrichedApplication) => void;
  onDelete: (a: EnrichedApplication) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map(col => {
        const colApps = apps.filter(a => a.status === col);
        const conf = statusConfig[col];
        return (
          <div key={col} className="flex-shrink-0 w-64">
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-3 ${conf.bg}`}>
              <span className={`text-xs font-semibold ${conf.color}`}>{conf.label}</span>
              <span className={`text-xs font-bold ${conf.color} bg-white px-1.5 py-0.5 rounded-full`}>
                {colApps.length}
              </span>
            </div>
            <div className="space-y-3">
              {colApps.map(app => (
                <KanbanCard key={app.application_id} app={app}
                  onTimeline={() => onTimeline(app)}
                  onStatusChange={() => onStatusChange(app)}
                  onDelete={() => onDelete(app)}
                />
              ))}
              {colApps.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-300 border-2 border-dashed border-slate-100 rounded-lg">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ app, onTimeline, onStatusChange, onDelete }: {
  app: EnrichedApplication;
  onTimeline: () => void; onStatusChange: () => void; onDelete: () => void;
}) {
  const typeConf = oppTypeConfig[app.opportunity.opp_type];
  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-1 mb-2">
        <Badge className={`${typeConf.bg} ${typeConf.color} shrink-0`}>{app.opportunity.opp_type}</Badge>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-xs font-semibold text-slate-900 leading-snug">{app.opportunity.title}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{app.opportunity.organization.org_name}</p>
      <p className="text-[10px] text-slate-300 mt-2">Updated {formatDate(app.updated_at)}</p>
      <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-50">
        <button onClick={onTimeline}
          className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
          <Clock className="w-3 h-3" /> Timeline
        </button>
        <button onClick={onStatusChange}
          className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] text-indigo-600 hover:bg-indigo-50 rounded font-medium transition-colors">
          <ArrowRight className="w-3 h-3" /> Update
        </button>
      </div>
    </Card>
  );
}

// ── Table View ────────────────────────────────────────────────
function TableView({ apps, onTimeline, onStatusChange, onDelete }: {
  apps: EnrichedApplication[];
  onTimeline: (a: EnrichedApplication) => void;
  onStatusChange: (a: EnrichedApplication) => void;
  onDelete: (a: EnrichedApplication) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Opportunity</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Applied</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Updated</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {apps.map(app => {
            const conf = statusConfig[app.status];
            const typeConf = oppTypeConfig[app.opportunity.opp_type];
            return (
              <tr key={app.application_id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{app.opportunity.title}</p>
                  <p className="text-xs text-slate-400">{app.opportunity.organization.org_name}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`${typeConf.bg} ${typeConf.color}`}>{app.opportunity.opp_type}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`${conf.bg} ${conf.color}`}>{conf.label}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(app.created_at)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(app.updated_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onTimeline(app)}>
                      <Clock className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onStatusChange(app)}>Update</Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(app)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// ── Timeline Modal ────────────────────────────────────────────
function TimelineModal({ app, onClose }: { app: EnrichedApplication; onClose: () => void }) {
  const uniqueHistory = app.history.filter((h, i, arr) =>
    arr.findIndex(x => x.history_id === h.history_id) === i
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Application Timeline" size="md">
      <div className="mb-4">
        <p className="font-semibold text-slate-900">{app.opportunity.title}</p>
        <p className="text-xs text-slate-400">{app.opportunity.organization.org_name}</p>
      </div>
      {uniqueHistory.length === 0 ? (
        <p className="text-sm text-slate-400">No history yet.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
          <div className="space-y-5">
            {uniqueHistory.map((h, i) => {
              const conf = statusConfig[h.status];
              return (
                <div key={h.history_id} className="relative flex gap-4">
                  <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${conf.bg}`}>
                    <span className={`text-[9px] font-bold ${conf.color}`}>{h.status.charAt(0)}</span>
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${conf.bg} ${conf.color}`}>{h.status}</Badge>
                      {i === uniqueHistory.length - 1 && (
                        <Badge className="bg-indigo-100 text-indigo-700">Current</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{formatDateTime(h.changed_at)}</p>
                    {h.note && <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 rounded-lg px-3 py-2 italic">"{h.note}"</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── Status Update Modal ──────────────────────────────────────
function StatusUpdateModal({ app, onClose, onUpdated }: {
  app: EnrichedApplication; onClose: () => void; onUpdated: () => void;
}) {
  const { showToast } = useAppContext();
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(app.status);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (newStatus === app.status && !note) { onClose(); return; }
    setSaving(true);
    await api.updateApplicationStatus(app.application_id, newStatus, note || undefined);
    showToast(`Status updated to "${newStatus}"`, 'success');
    setSaving(false);
    onUpdated();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Update Application Status" size="md">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 mb-1">Opportunity</p>
          <p className="font-semibold text-slate-900">{app.opportunity.title}</p>
          <p className="text-xs text-slate-400">{app.opportunity.organization.org_name}</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Badge className={`${statusConfig[app.status].bg} ${statusConfig[app.status].color}`}>{app.status}</Badge>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <Badge className={`${statusConfig[newStatus].bg} ${statusConfig[newStatus].color}`}>{newStatus}</Badge>
        </div>
        <Select
          label="New Status"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value as ApplicationStatus)}
          options={ALL_STATUSES.map(s => ({ value: s, label: statusConfig[s].label }))}
        />
        <Textarea
          label="Note (optional)"
          placeholder="e.g. Technical round cleared, waiting for HR feedback…"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
        />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={handleSave} loading={saving} className="flex-1">
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
