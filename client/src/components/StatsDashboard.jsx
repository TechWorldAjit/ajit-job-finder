import React from 'react';
import { Briefcase, Sparkles, Building2, Rocket, Globe, Target } from 'lucide-react';

export default function StatsDashboard({ meta }) {
  if (!meta) return null;

  const statCards = [
    {
      label: 'Total Discovered',
      value: (meta.totalDiscovered || 0).toLocaleString(),
      subtext: `Pool Cap: ${meta.limitRequested || 1000}`,
      icon: <Briefcase className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/60',
      text: 'text-indigo-900 dark:text-indigo-200',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/60'
    },
    {
      label: 'Top Matches (≥85%)',
      value: (meta.topMatchesCount || 0).toLocaleString(),
      subtext: 'High role & skill fit',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60',
      text: 'text-emerald-900 dark:text-emerald-200',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60'
    },
    {
      label: 'Top Companies',
      value: (meta.topCompaniesCount || 0).toLocaleString(),
      subtext: 'Global industry leaders',
      icon: <Building2 className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-800/60',
      text: 'text-purple-900 dark:text-purple-200',
      iconBg: 'bg-purple-100 dark:bg-purple-900/60'
    },
    {
      label: 'Startups & Emerging',
      value: ((meta.startupsCount || 0) + (meta.newCompaniesCount || 0)).toLocaleString(),
      subtext: 'High-growth & seed stage',
      icon: <Rocket className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60',
      text: 'text-amber-900 dark:text-amber-200',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60'
    },
    {
      label: 'Remote Opportunities',
      value: (meta.remoteCount || 0).toLocaleString(),
      subtext: `${meta.hybridCount || 0} hybrid, ${meta.onSiteCount || 0} on-site`,
      icon: <Globe className="w-5 h-5 text-cyan-500" />,
      bg: 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-800/60',
      text: 'text-cyan-900 dark:text-cyan-200',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/60'
    },
    {
      label: 'Average AI Match',
      value: `${meta.avgScore || 0}%`,
      subtext: 'Weighted 6-factor model',
      icon: <Target className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/60',
      text: 'text-rose-900 dark:text-rose-200',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${card.bg} shadow-sm hover:shadow-md transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 truncate">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg} shadow-2xs`}>
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-black tracking-tight ${card.text}`}>
              {card.value}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {card.subtext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
