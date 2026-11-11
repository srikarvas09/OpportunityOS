// ============================================================
// Dashboard Page — Intelligence Overview
// ============================================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle, TrendingUp, Clock, Star, AlertTriangle, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';
import type { DashboardStats } from '../services/api';
import {
  KpiCard, Card, Badge, Button, Spinner, EmptyState, ProgressBar,
} from '../components/ui';
import {
  formatDate, formatReward, daysUntil,
  oppTypeConfig, workModeConfig,
} from '../utils/helpers';

export function DashboardPage() {
  const { activeStudentId, activeStudent } = useAppContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getDashboardStats(activeStudentId).then(s => {
      setStats(s);
      setLoading(false);
    });
  }, [activeStudentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!stats || !activeStudent) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {activeStudent.full_name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here's your personalized intelligence overview for today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <KpiCard
          title="Eligible Opportunities"
          value={stats.eligibleActiveCount}
          subtitle="Active, not expired"
          icon={<Star className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
        />
        <KpiCard
          title="Applications Submitted"
          value={stats.submittedCount}
          subtitle="Saved not included"
          icon={<Briefcase className="w-5 h-5 text-violet-600" />}
          iconBg="bg-violet-100"
        />
        <KpiCard
          title="Shortlisted / Interviews"
          value={stats.interviewShortlistCount}
          subtitle="Active pipeline"
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
          trend={stats.interviewShortlistCount > 0 ? '🎉 Great progress!' : undefined}
        />
        <KpiCard
          title="Avg. Skill Match"
          value={`${stats.avgSkillMatch}%`}
          subtitle="Across all opportunities"
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top Recommended */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              Top Recommended for You
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/opportunities')}>
              View all →
            </Button>
          </div>
          <div className="space-y-3">
            {stats.topRecommended.length === 0 ? (
              <EmptyState title="No eligible opportunities found" description="Update your profile to get personalized recommendations." />
            ) : (
              stats.topRecommended.map(opp => (
                <Card key={opp.opp_id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/opportunities')}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${oppTypeConfig[opp.opp_type].bg} ${oppTypeConfig[opp.opp_type].color}`}>
                          {oppTypeConfig[opp.opp_type].label}
                        </Badge>
                        <Badge className={`${workModeConfig[opp.work_mode].bg} ${workModeConfig[opp.work_mode].color}`}>
                          {opp.work_mode}
                        </Badge>
                      </div>
                      <p className="font-semibold text-slate-900 mt-1.5 text-sm">{opp.title}</p>
                      <p className="text-xs text-slate-500">{opp.organization.org_name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatReward(opp.reward_amount, opp.reward_unit)} ·{' '}
                        {opp.duration_weeks ? `${opp.duration_weeks}w` : 'Flexible'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
                        {opp.skillMatch.matchScore}% match
                      </div>
                      <ProgressBar
                        value={opp.skillMatch.matchScore}
                        className="mt-1.5 w-20"
                        color={opp.skillMatch.matchScore >= 70 ? 'bg-emerald-500' : opp.skillMatch.matchScore >= 40 ? 'bg-amber-400' : 'bg-red-400'}
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900">Upcoming Deadlines</h2>
          </div>
          <Card className="divide-y divide-slate-50">
            {stats.upcomingDeadlines.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-400">No deadlines found</div>
            ) : (
              stats.upcomingDeadlines.map(opp => {
                const days = daysUntil(opp.deadline);
                const expired = days < 0;
                const urgent = !expired && days <= 7;
                return (
                  <div key={opp.opp_id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate('/opportunities')}>
                    <div className={`shrink-0 w-9 h-9 rounded-lg flex flex-col items-center justify-center text-xs font-bold
                      ${expired ? 'bg-red-100 text-red-600' : urgent ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {expired ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <>
                          <span className="text-lg leading-none font-bold">{days}</span>
                          <span className="text-[9px] leading-none">days</span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{opp.title}</p>
                      <p className="text-[10px] text-slate-400">{opp.organization.org_name}</p>
                      <p className={`text-[10px] font-medium mt-0.5 ${expired ? 'text-red-500' : urgent ? 'text-amber-600' : 'text-slate-400'}`}>
                        {expired ? 'CLOSED' : `Due ${formatDate(opp.deadline)}`}
                      </p>
                    </div>
                    <Badge className={`${oppTypeConfig[opp.opp_type].bg} ${oppTypeConfig[opp.opp_type].color} shrink-0`}>
                      {opp.opp_type}
                    </Badge>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
