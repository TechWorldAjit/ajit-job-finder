import React, { useState } from 'react';
import { Briefcase, Award, ChevronDown, ChevronUp, Layers, Cpu, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

export default function ProfileCard({ profile, onEditProfile }) {
  const [expanded, setExpanded] = useState(false);

  if (!profile) return null;

  const candidateName = toSafeString(profile.fullName || profile.name) || 'Professional Candidate';
  const currentRole = toSafeString(profile.currentRole) || 'Identified Career Profile';
  const experienceLevel = toSafeString(profile.experienceLevel) || 'Senior Level';
  const suitableTitles = (profile.suitableJobTitles || []).map(toSafeString).filter(Boolean);
  const primarySkills = (profile.skills || []).map(toSafeString).filter(Boolean);
  const toolsSoftware = (profile.toolsAndSoftware || []).map(toSafeString).filter(Boolean);
  const transferableSkills = (profile.transferableSkills || []).map(toSafeString).filter(Boolean);
  const targetIndustries = (profile.targetIndustries || profile.industryKnowledge || []).map(toSafeString).filter(Boolean);

  return (
    <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-indigo-500/5 p-6 sm:p-8 mb-8 transition-all relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-pink-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-purple-500/25 shrink-0">
            {candidateName.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {candidateName}
              </h2>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                {experienceLevel}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{currentRole}</span> • {profile.yearsOfExperience || 5}+ Years Professional Experience
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onEditProfile}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#1A2234] text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-xs"
          >
            Change Candidate
          </button>
        </div>
      </div>

      {/* AI Discovered Job Titles Banner */}
      <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/40 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              AI-Mapped Target Job Categories (Zero Manual Title Entry)
            </span>
          </div>
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Multi-Category Discovery Active
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          The engine automatically discovered these suitable titles across your primary capabilities and adjacent transferable fields:
        </p>

        {/* Suitable Titles Tags */}
        <div className="flex flex-wrap gap-2">
          {suitableTitles.map((title, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white dark:bg-[#182032] border border-indigo-200/80 dark:border-indigo-800/80 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:scale-[1.02]"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-2 shrink-0" />
              <span>{title}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-5">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {profile.summary}
        </p>
      </div>

      {/* Core Capabilities Breakdown */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Skills */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>Primary Skills</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {primarySkills.slice(0, 6).map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60 font-semibold text-[11px]">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tools & Software */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Tools & Software</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {toolsSoftware.slice(0, 6).map((t, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/60 font-semibold text-[11px]">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Transferable Skills */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Transferable Vectors</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {transferableSkills.slice(0, 4).map((ts, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/60 font-semibold text-[11px]">
                {ts}
              </span>
            ))}
          </div>
        </div>

        {/* Target Industries */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span>Target Sectors</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {targetIndustries.slice(0, 4).map((ind, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60 font-semibold text-[11px]">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expand/Collapse Full History */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>{expanded ? 'Hide Complete History & Education' : 'View Full Roles & Education'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Previous Roles & Experience</h4>
            <div className="space-y-3">
              {(profile.roles || []).map((r, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161F31] border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{r.title} @ {r.company}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">{r.duration}</span>
                  </div>
                  {r.highlights && (
                    <ul className="mt-2 list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                      {r.highlights.map((h, j) => (
                        <li key={j}>{toSafeString(h)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {profile.education && profile.education.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Education & Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {profile.education.map((edu, idx) => (
                  <span key={idx} className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#161F31] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    {toSafeString(edu.degree)} — {toSafeString(edu.institution)} ({toSafeString(edu.year)})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
