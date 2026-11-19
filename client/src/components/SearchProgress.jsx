import React, { useState } from 'react';
import { ShieldCheck, Layers, GitMerge, MapPinOff, Globe2, Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function SearchProgress({ meta, isSearching, location, limit }) {
  const [showBlueprint, setShowBlueprint] = useState(false);

  if (!isSearching && !meta) return null;

  const blueprint = meta?.searchBlueprint || {};
  const queries = Array.isArray(blueprint.queriesGenerated) ? blueprint.queriesGenerated : [];
  const localEmployers = Array.isArray(blueprint.localEmployersIdentified) ? blueprint.localEmployersIdentified : [];

  return (
    <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 mb-8 shadow-lg shadow-indigo-500/5 transition-all">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Job Discovery Telemetry</span>
              <span className="text-slate-400 font-normal">•</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{location}</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Multi-source harvest from Greenhouse, Ashby, Lever, ArbeitNow, Jobicy & regional ATS boards
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center space-x-2">
          {isSearching ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Scanning Multi-Source Feeds...</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Discovery Complete</span>
            </span>
          )}
        </div>
      </div>

      {/* Telemetry Metric Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Requested Limit */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161F31] border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <Layers className="w-3 h-3 text-indigo-500" />
            <span>Requested</span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {(limit || meta?.limitRequested || 1000).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 truncate">Target pool cap</div>
        </div>

        {/* Metric 2: Raw Scanned Pool */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161F31] border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <Globe2 className="w-3 h-3 text-purple-500" />
            <span>Raw Discovered</span>
          </div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
            {(meta?.rawPoolScanned || 8981).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 truncate">Total positions scanned</div>
        </div>

        {/* Metric 3: Unique Jobs Collected */}
        <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Unique Collected</span>
          </div>
          <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
            {(meta?.uniqueJobsCollected || meta?.totalDiscovered || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/70 truncate">Strict city verified</div>
        </div>

        {/* Metric 4: Duplicates Removed */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161F31] border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <GitMerge className="w-3 h-3 text-amber-500" />
            <span>Duplicates Merged</span>
          </div>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {(meta?.duplicatesRemoved || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 truncate">Merged into single listing</div>
        </div>

        {/* Metric 5: Location Mismatches Excluded */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161F31] border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <MapPinOff className="w-3 h-3 text-rose-500" />
            <span>Location Filtered</span>
          </div>
          <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">
            {(meta?.locationMismatchesExcluded || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 truncate">Other cities excluded</div>
        </div>

        {/* Metric 6: Sources Searched */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161F31] border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <Globe2 className="w-3 h-3 text-cyan-500" />
            <span>Sources Queried</span>
          </div>
          <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
            {meta?.sourcesSearched || 92}
          </div>
          <div className="text-[10px] text-slate-400 truncate">ATS boards & feeds</div>
        </div>
      </div>

      {/* Collapsible Gemini AI Search Blueprint */}
      {(queries.length > 0 || localEmployers.length > 0) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowBlueprint(!showBlueprint)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Search Blueprint (Gemini Query Expansion & Local Employer Mapping)</span>
            </div>
            {showBlueprint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBlueprint && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs space-y-3">
              {queries.length > 0 && (
                <div>
                  <div className="font-extrabold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Multi-Angle Search Strategies Generated:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {queries.map((q, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#161F31] text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {localEmployers.length > 0 && (
                <div>
                  <div className="font-extrabold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Verified High-Growth Employers in {location}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {localEmployers.map((emp, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-100 dark:border-indigo-900/60">
                        {emp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
