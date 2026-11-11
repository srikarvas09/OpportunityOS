// Shared UI Components for OpportunityOS
import React from 'react';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ─── Badge ─────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}
export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className)}>
      {children}
    </span>
  );
}

// ─── Button ────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
export function Button({ children, variant = 'primary', size = 'md', loading, className, disabled, ...props }: ButtonProps) {
  const variants = {
    primary:   'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
    ghost:     'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent',
    danger:    'bg-red-600 hover:bg-red-700 text-white border border-red-600',
    success:   'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600',
  };
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Card ──────────────────────────────────────────────────────
export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-white rounded-xl border border-slate-100 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}
export function Input({ label, error, helpText, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white',
          'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:opacity-50 disabled:bg-slate-50',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helpText && !error && <p className="text-xs text-slate-400">{helpText}</p>}
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}
export function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={selectId} className="text-sm font-medium text-slate-700">{label}</label>}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:opacity-50',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Textarea ──────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white resize-none',
          'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}
export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full bg-white rounded-2xl shadow-xl', sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────
interface ProgressBarProps { value: number; max?: number; className?: string; color?: string }
export function ProgressBar({ value, max = 100, className, color = 'bg-indigo-500' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('w-full bg-slate-100 rounded-full h-2 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────
interface EmptyStateProps { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      {icon && <div className="text-slate-300 text-5xl mb-2">{icon}</div>}
      <p className="text-slate-600 font-medium">{title}</p>
      {description && <p className="text-sm text-slate-400 max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// ─── Spinner ───────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin h-5 w-5 text-indigo-600', className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: string;
}
export function KpiCard({ title, value, subtitle, icon, iconBg = 'bg-indigo-100', trend }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          {trend && <p className="text-xs text-emerald-600 font-medium mt-1">{trend}</p>}
        </div>
        <div className={cn('p-2.5 rounded-xl', iconBg)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ─── Toggle ────────────────────────────────────────────────────
interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label?: string }
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex w-10 h-5 rounded-full transition-colors duration-200',
          checked ? 'bg-indigo-600' : 'bg-slate-200'
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )} />
      </div>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
