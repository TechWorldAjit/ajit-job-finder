import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function SortBar({
  sortBy,
  setSortBy,
  totalMatching,
  totalDiscovered
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800 gap-3">
      {/* Result Count Status */}
      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
        Showing <span className="font-extrabold text-slate-900 dark:text-white">{totalMatching.toLocaleString()}</span> opportunities
        {totalMatching !== totalDiscovered && (
          <span className="text-slate-500"> (filtered from {totalDiscovered.toLocaleString()} in search pool)</span>
        )}
      </div>

      {/* Sorting Dropdown */}
      <div className="flex items-center space-x-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
          <span>Sort By:</span>
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#131A29] hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer shadow-xs"
          >
            <option value="best_match">Best Match (Highest AI Score)</option>
            <option value="best_companies">Top Companies First</option>
            <option value="company_name">Company Name (A–Z)</option>
            <option value="highest_salary">Highest Salary</option>
            <option value="newest_jobs">Newest Postings</option>
            <option value="lowest_experience">Lowest Experience Requirement</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}
