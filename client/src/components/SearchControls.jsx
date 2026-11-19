import React from 'react';
import { MapPin, Search, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

export default function SearchControls({
  location = '',
  setLocation,
  limit,
  setLimit,
  onSearch,
  isSearching,
  hasProfile
}) {
  const quickLocations = [
    { name: 'San Francisco', badge: '🌉 SF' },
    { name: 'New York', badge: '🗽 NYC' },
    { name: 'London', badge: '🇬🇧 UK' },
    { name: 'Toronto', badge: '🇨🇦 Canada' },
    { name: 'California', badge: '🇺🇸 CA' },
    { name: 'Singapore', badge: '🇸🇬 APAC' },
    { name: 'Berlin', badge: '🇪🇺 EU' },
    { name: 'Remote / Worldwide', badge: '🌐 Global' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location || !location.trim()) return;
    onSearch();
  };

  const safeLocation = String(location || '').toLowerCase();

  return (
    <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-indigo-500/5 p-6 sm:p-8 mb-8 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Location Input (Required) */}
          <div className="flex-1 relative">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Job Location <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                City, State, Country, or Multiple Hubs
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, California, Singapore, Toronto, Germany, Remote..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-50/70 dark:bg-[#161F31] text-slate-900 dark:text-white text-sm font-semibold transition-all shadow-2xs"
              />
              <MapPin className="w-5 h-5 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Number of Results Dropdown */}
          <div className="w-full lg:w-60">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-1.5">
              <SlidersHorizontal className="w-4 h-4 text-purple-500" />
              <span>Target Pool Size</span>
            </label>
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full pl-4 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-50/70 dark:bg-[#161F31] text-slate-900 dark:text-white text-sm font-bold appearance-none cursor-pointer transition-all shadow-2xs"
              >
                <option value={50}>50 opportunities</option>
                <option value={100}>100 opportunities</option>
                <option value={500}>500 opportunities</option>
                <option value={1000}>1,000 opportunities (Default)</option>
                <option value={5000}>5,000 opportunities (Maximum)</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:self-end">
            <button
              type="submit"
              disabled={isSearching || !location.trim() || !hasProfile}
              className="w-full lg:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 text-white text-sm font-extrabold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Discovering Vacancies...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Discover Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Location Chips */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Popular Hubs:
          </span>
          {quickLocations.map((loc) => {
            const isMatch = safeLocation === String(loc.name || '').toLowerCase();
            return (
              <button
                type="button"
                key={loc.name}
                onClick={() => setLocation(loc.name)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center space-x-1.5 shadow-2xs ${
                  isMatch
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-[#161F31] border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1C273D]'
                }`}
              >
                <span>{loc.badge}</span>
                <span>{loc.name}</span>
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}
