import React from 'react';
import { Filter, X, Sparkles, Building2, Rocket, Globe, Shield, Zap } from 'lucide-react';

export const FILTER_DEFINITIONS = [
  { id: 'all', label: 'All Jobs', icon: null },
  { id: 'top_matches', label: 'Top Matches (≥85%)', icon: Sparkles, color: 'emerald' },
  { id: 'top_companies', label: 'Top Companies', icon: Building2, color: 'purple' },
  { id: 'startups', label: 'Startups', icon: Rocket, color: 'amber' },
  { id: 'established', label: 'Established', icon: Shield, color: 'blue' },
  { id: 'new_companies', label: 'New Companies', icon: Zap, color: 'rose' },
  { id: 'remote', label: 'Remote Only', icon: Globe, color: 'cyan' },
  { id: 'hybrid', label: 'Hybrid', icon: null },
  { id: 'onsite', label: 'On-site', icon: null },
  { id: 'entry', label: 'Entry Level', icon: null },
  { id: 'mid', label: 'Mid-Level', icon: null },
  { id: 'senior', label: 'Senior Level', icon: null }
];

export default function FilterChips({
  activeFilters = [],
  onToggleFilter,
  onClearFilters,
  filterCounts = {}
}) {
  const isAllActive = activeFilters.length === 0 || activeFilters.includes('all');

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interactive Filters
          </span>
          {!isAllActive && (
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {activeFilters.length} Active
            </span>
          )}
        </div>

        {!isAllActive && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Chips Wrap Container */}
      <div className="flex flex-wrap gap-2">
        {FILTER_DEFINITIONS.map((def) => {
          const isActive = def.id === 'all' ? isAllActive : activeFilters.includes(def.id);
          const count = filterCounts[def.id] ?? 0;
          const Icon = def.icon;

          return (
            <button
              key={def.id}
              onClick={() => onToggleFilter(def.id)}
              className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-[#131A29] hover:bg-slate-50 dark:hover:bg-[#1C273D] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />}
              <span>{def.label}</span>
              {def.id !== 'all' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ml-1 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#1E283E] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
