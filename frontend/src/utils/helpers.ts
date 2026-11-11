// ============================================================
// Utility helpers
// ============================================================
import { clsx, type ClassValue } from 'clsx';
import type { ApplicationStatus, OppType, WorkMode, OrgType } from '../types/database';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatReward(amount: number | null, unit: string | null): string {
  if (!amount) return 'Unpaid / Academic';
  const formatted = new Intl.NumberFormat('en-IN').format(amount);
  return unit === 'Per month' ? `₹${formatted} / month` : `₹${formatted} one-time`;
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr);
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isExpired(dateStr: string): boolean {
  return daysUntil(dateStr) < 0;
}

export const statusConfig: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  Saved:       { label: 'Saved',       color: 'text-slate-700',  bg: 'bg-slate-100' },
  Applied:     { label: 'Applied',     color: 'text-blue-700',   bg: 'bg-blue-100' },
  Shortlisted: { label: 'Shortlisted', color: 'text-amber-700',  bg: 'bg-amber-100' },
  Interview:   { label: 'Interview',   color: 'text-violet-700', bg: 'bg-violet-100' },
  Selected:    { label: 'Selected',    color: 'text-emerald-700',bg: 'bg-emerald-100' },
  Rejected:    { label: 'Rejected',    color: 'text-red-700',    bg: 'bg-red-100' },
};

export const oppTypeConfig: Record<OppType, { label: string; color: string; bg: string }> = {
  Internship:  { label: 'Internship',  color: 'text-indigo-700', bg: 'bg-indigo-100' },
  Research:    { label: 'Research',    color: 'text-violet-700', bg: 'bg-violet-100' },
  Hackathon:   { label: 'Hackathon',   color: 'text-orange-700', bg: 'bg-orange-100' },
  Competition: { label: 'Competition', color: 'text-rose-700',   bg: 'bg-rose-100' },
  Scholarship: { label: 'Scholarship', color: 'text-emerald-700',bg: 'bg-emerald-100' },
};

export const workModeConfig: Record<WorkMode, { label: string; color: string; bg: string }> = {
  Remote:  { label: 'Remote',  color: 'text-teal-700',  bg: 'bg-teal-100' },
  Onsite:  { label: 'Onsite',  color: 'text-slate-700', bg: 'bg-slate-100' },
  Hybrid:  { label: 'Hybrid',  color: 'text-purple-700',bg: 'bg-purple-100' },
};

export const orgTypeConfig: Record<OrgType, { color: string; bg: string }> = {
  Company:    { color: 'text-blue-700',    bg: 'bg-blue-50' },
  University: { color: 'text-violet-700',  bg: 'bg-violet-50' },
  NGO:        { color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Government: { color: 'text-amber-700',   bg: 'bg-amber-50' },
  Other:      { color: 'text-slate-700',   bg: 'bg-slate-50' },
};

export const ALL_STATUSES: ApplicationStatus[] = [
  'Saved', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected',
];

export const KANBAN_COLUMNS: ApplicationStatus[] = [
  'Saved', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected',
];
