// ============================================================
// Sidebar Navigation Layout
// ============================================================
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Search, Briefcase, User, Building2,
  Settings, ChevronDown, Zap, RefreshCcw,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../utils/helpers';
import { ToastContainer } from './ToastContainer';
import * as api from '../services/api';

const navItems = [
  { to: '/',               label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/opportunities',  label: 'Opportunities',      icon: Search },
  { to: '/applications',   label: 'My Applications',    icon: Briefcase },
  { to: '/profile',        label: 'Profile & Skills',   icon: User },
  { to: '/organizations',  label: 'Organizations',      icon: Building2 },
  { to: '/admin',          label: 'Admin Panel',        icon: Settings },
];

export function Layout() {
  const { activeStudent, students, setActiveStudentId, activeStudentId, showToast } = useAppContext();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    await api.resetDatabase();
    showToast('Database reset to seed data!', 'info');
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 shadow-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">OpportunityOS</p>
              <p className="text-[10px] text-slate-400 leading-none">Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Reset Button */}
        <div className="px-3 pb-2">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <RefreshCcw className={cn('w-3 h-3', resetting && 'animate-spin')} />
            Reset to Seed Data
          </button>
        </div>

        {/* Student switcher */}
        <div className="px-3 pb-4 relative">
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-slate-100"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {activeStudent?.full_name?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{activeStudent?.full_name ?? '...'}</p>
              <p className="text-[10px] text-slate-400">Year {activeStudent?.current_year} · CGPA {activeStudent?.cgpa}</p>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform shrink-0', switcherOpen && 'rotate-180')} />
          </button>

          {switcherOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden z-50">
              <p className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                Switch Active Student
              </p>
              {students.map(s => (
                <button
                  key={s.student_id}
                  onClick={() => { setActiveStudentId(s.student_id); setSwitcherOpen(false); }}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors',
                    s.student_id === activeStudentId && 'bg-indigo-50'
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {s.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className={cn('text-sm font-medium', s.student_id === activeStudentId ? 'text-indigo-700' : 'text-slate-700')}>
                      {s.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400">Yr {s.current_year} · {s.cgpa} CGPA</p>
                  </div>
                  {s.student_id === activeStudentId && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
}
