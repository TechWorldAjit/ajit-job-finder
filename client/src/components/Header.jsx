import React from 'react';
import { Sparkles, Bookmark, RefreshCw, Moon, Sun, Compass, Zap } from 'lucide-react';

export default function Header({
  savedJobsCount,
  appliedJobsCount,
  onOpenSavedDrawer,
  hasProfile,
  onResetProfile,
  theme,
  onToggleTheme
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#0A0D14]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity: Ajit Job Finder */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-purple-500/25 flex items-center justify-center text-white shrink-0">
              <div className="w-full h-full bg-white/10 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="text-slate-900 dark:text-white">Ajit </span>
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Job Finder
                  </span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
                  AI Discovery
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                Skill-to-role matching across 2,000+ live opportunities • Zero manual title input
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gemini AI Connected</span>
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A29] hover:bg-slate-50 dark:hover:bg-[#1B2438] text-slate-600 dark:text-slate-300 transition-all shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Saved & Applied Drawer Trigger */}
            <button
              onClick={onOpenSavedDrawer}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131A29] hover:bg-slate-50 dark:hover:bg-[#1B2438] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
            >
              <Bookmark className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="hidden sm:inline">Tracker</span>
              {(savedJobsCount > 0 || appliedJobsCount > 0) && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white font-bold text-[10px]">
                  {savedJobsCount + appliedJobsCount}
                </span>
              )}
            </button>

            {/* Change Profile (if profile loaded) */}
            {hasProfile && (
              <button
                onClick={onResetProfile}
                title="Change or re-upload candidate profile"
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Change Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
