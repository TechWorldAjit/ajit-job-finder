import React, { useState } from 'react';
import { X, Bookmark, CheckCircle2, ExternalLink, Trash2, MapPin } from 'lucide-react';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

export default function SavedJobsDrawer({
  isOpen,
  onClose,
  savedJobs = [],
  appliedJobs = [],
  onRemoveSaved,
  onRemoveApplied
}) {
  const [tab, setTab] = useState('saved'); // 'saved' | 'applied'

  if (!isOpen) return null;

  const currentList = tab === 'saved' ? savedJobs : appliedJobs;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-[#111622] h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              My Opportunities Tracker
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A2234] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0B0F17] border-b border-slate-100 dark:border-slate-800 flex space-x-2">
          <button
            onClick={() => setTab('saved')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              tab === 'saved'
                ? 'bg-white dark:bg-[#1A2234] text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            onClick={() => setTab('applied')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              tab === 'applied'
                ? 'bg-white dark:bg-[#1A2234] text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Applied ({appliedJobs.length})
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentList.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-[#1A2234] flex items-center justify-center mb-3 text-slate-400">
                {tab === 'saved' ? <Bookmark className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No {tab} jobs yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {tab === 'saved'
                  ? 'Click "Save" on any opportunity card to keep track of interesting roles.'
                  : 'Click "Mark Applied" on jobs where you have submitted an application.'}
              </p>
            </div>
          ) : (
            currentList.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161F31] shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {toSafeString(job.companyName)}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {toSafeString(job.title)}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{toSafeString(job.location)}</span>
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                        {job.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => tab === 'saved' ? onRemoveSaved(job) : onRemoveApplied(job)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {tab === 'applied' && job.appliedAt ? `Applied ${new Date(job.appliedAt).toLocaleDateString()}` : toSafeString(job.companyCategory)}
                  </span>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    <span>View / Apply</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
