import React, { useState } from 'react';
import {
  Building2, MapPin, Briefcase, Calendar, DollarSign,
  Sparkles, CheckCircle2, Bookmark, Check, ExternalLink,
  Shield, Rocket, Zap, Award, HelpCircle
} from 'lucide-react';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

export default function JobCard({
  job = {},
  onOpenScoreBreakdown,
  isSaved,
  onToggleSave,
  isApplied,
  onToggleApplied
}) {
  const [logoError, setLogoError] = useState(false);

  const title = toSafeString(job.title) || 'Untitled Opportunity';
  const companyName = toSafeString(job.companyName) || 'Verified Employer';
  const location = toSafeString(job.location) || 'Remote / Worldwide';
  const companyCategory = toSafeString(job.companyCategory) || 'Established Companies';
  const workMode = toSafeString(job.workMode) || 'On-site';
  const score = Number(job.matchScore) || 50;
  const whyMatches = Array.isArray(job.whyMatches) ? job.whyMatches : [];
  const matchedSkills = Array.isArray(job.matchedSkills) ? job.matchedSkills : [];
  const missingSkills = Array.isArray(job.missingSkills) ? job.missingSkills : [];

  // Match score visual styling
  const getScoreBadge = (val) => {
    if (val >= 90) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-xs shadow-emerald-500/10',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700 dark:text-emerald-300'
      };
    } else if (val >= 80) {
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-xs shadow-indigo-500/10',
        dot: 'bg-indigo-500',
        text: 'text-indigo-700 dark:text-indigo-300'
      };
    } else if (val >= 70) {
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        dot: 'bg-purple-500',
        text: 'text-purple-700 dark:text-purple-300'
      };
    } else {
      return {
        bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        dot: 'bg-slate-400',
        text: 'text-slate-700 dark:text-slate-300'
      };
    }
  };

  // Company category badge styling
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Top Companies':
        return {
          icon: <Award className="w-3.5 h-3.5 text-purple-500 mr-1" />,
          label: 'Top Company',
          cls: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
        };
      case 'Startups':
        return {
          icon: <Rocket className="w-3.5 h-3.5 text-amber-500 mr-1" />,
          label: 'Startup',
          cls: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
        };
      case 'New Companies':
        return {
          icon: <Zap className="w-3.5 h-3.5 text-rose-500 mr-1" />,
          label: 'New Company',
          cls: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
        };
      default:
        return {
          icon: <Shield className="w-3.5 h-3.5 text-blue-500 mr-1" />,
          label: 'Established Company',
          cls: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
        };
    }
  };

  // Work mode styling
  const getWorkModeBadge = (mode) => {
    switch (mode) {
      case 'Remote':
        return 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60';
      case 'Hybrid':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const scoreBadge = getScoreBadge(score);
  const catBadge = getCategoryBadge(companyCategory);

  // Format relative date
  const formatPostingDate = (isoDate) => {
    if (!isoDate) return 'Recently posted';
    try {
      const diffDays = Math.round((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.round(diffDays / 7)} weeks ago`;
      return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Recently posted';
    }
  };

  return (
    <div className={`bg-white dark:bg-[#111622] rounded-3xl border transition-all duration-200 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 ${
      score >= 85
        ? 'border-indigo-200 dark:border-indigo-800/80 ring-1 ring-indigo-500/10'
        : 'border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Company & Title */}
        <div className="flex items-start space-x-4">
          {/* Logo or Fallback Avatar */}
          <div className="w-14 h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1A2234] flex items-center justify-center p-2.5 shrink-0 shadow-xs overflow-hidden">
            {!logoError && job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={companyName}
                onError={() => setLogoError(true)}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
                {companyName.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {companyName}
              </span>
              {/* Company Category Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${catBadge.cls}`}>
                {catBadge.icon}
                <span>{catBadge.label}</span>
              </span>
              {/* Work Mode Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getWorkModeBadge(workMode)}`}>
                {workMode}
              </span>
              {isApplied && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                  <Check className="w-3 h-3 mr-1" />
                  Applied
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {title}
            </h3>

            {/* Location & Metadata row */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span className={job.salary ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}>
                  {toSafeString(job.salary) || 'Competitive / Not disclosed'}
                </span>
              </span>
              <span className="flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                <span>Exp: {toSafeString(job.requiredExperience) || '2-5 Years'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatPostingDate(job.pubDate)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* AI Match Score Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <div className={`px-4 py-2 rounded-2xl border ${scoreBadge.bg} flex items-center space-x-2 shadow-xs`}>
              <span className={`w-2 h-2 rounded-full ${scoreBadge.dot} animate-pulse`}></span>
              <span className="text-sm font-extrabold tracking-tight">
                {score}% AI Match
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenScoreBreakdown(job)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors underline decoration-indigo-300 underline-offset-2 flex items-center space-x-1"
          >
            <span>6-Factor Breakdown</span>
            <HelpCircle className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* "Why this matches" section */}
      <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#161F31]/70 border border-slate-100 dark:border-slate-800">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Why this matches your capability:</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {whyMatches.map((point, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{toSafeString(point)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills Matched and Missing Skills */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            Skills Matched:
          </span>
          {matchedSkills.length > 0 ? (
            matchedSkills.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold text-[11px]"
              >
                <Check className="w-3 h-3 mr-1 text-emerald-500" />
                {toSafeString(s)}
              </span>
            ))
          ) : (
            <span className="text-slate-400 italic text-[11px]">Domain capability alignment</span>
          )}

          {missingSkills.length > 0 && (
            <>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-2 mr-1">
                Preferred:
              </span>
              {missingSkills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[11px]"
                >
                  {toSafeString(s)}
                </span>
              ))}
            </>
          )}
        </div>

        {/* Source info */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Source: <span className="font-semibold text-slate-700 dark:text-slate-300">{toSafeString(job.source) || 'Verified Career Portal'}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave(job)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              isSaved
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                : 'bg-white dark:bg-[#161F31] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E283E]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Mark as Applied Toggle */}
          <button
            onClick={() => onToggleApplied(job)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              isApplied
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-white dark:bg-[#161F31] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E283E]'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isApplied ? 'text-emerald-500' : ''}`} />
            <span>{isApplied ? 'Applied' : 'Mark Applied'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View Job / Details */}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#161F31] hover:bg-slate-50 dark:hover:bg-[#1E283E] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
          >
            <span>View Job</span>
          </a>

          {/* Apply Button */}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
