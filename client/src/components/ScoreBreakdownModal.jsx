import React from 'react';
import { X, Sparkles, Building2, Briefcase, Award, Shield, Target, Info } from 'lucide-react';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

export default function ScoreBreakdownModal({ job, onClose }) {
  if (!job) return null;

  const breakdown = job.scoreBreakdown || {};

  const factorItems = [
    {
      name: 'Skills Match',
      weight: 30,
      score: breakdown.skills?.score ?? 75,
      contribution: breakdown.skills?.contribution ?? 22.5,
      desc: 'Toolchain & technical capability overlap between candidate profile and job requirements',
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
      barColor: 'bg-gradient-to-r from-emerald-500 to-teal-400'
    },
    {
      name: 'Professional Experience',
      weight: 25,
      score: breakdown.experience?.score ?? 80,
      contribution: breakdown.experience?.contribution ?? 20.0,
      desc: 'Seniority alignment, career progression, and semantic role proximity',
      icon: <Briefcase className="w-4 h-4 text-indigo-500" />,
      barColor: 'bg-gradient-to-r from-indigo-500 to-blue-500'
    },
    {
      name: 'Job Responsibilities',
      weight: 20,
      score: breakdown.responsibilities?.score ?? 70,
      contribution: breakdown.responsibilities?.contribution ?? 14.0,
      desc: 'Action capability overlap (architecture, system delivery, execution track record)',
      icon: <Target className="w-4 h-4 text-purple-500" />,
      barColor: 'bg-gradient-to-r from-purple-500 to-violet-500'
    },
    {
      name: 'Industry Relevance',
      weight: 10,
      score: breakdown.industry?.score ?? 70,
      contribution: breakdown.industry?.contribution ?? 7.0,
      desc: 'Domain sector proximity (FinTech, SaaS, Cloud, AI, Media, E-commerce)',
      icon: <Award className="w-4 h-4 text-amber-500" />,
      barColor: 'bg-gradient-to-r from-amber-500 to-orange-400'
    },
    {
      name: 'Experience-Level Suitability',
      weight: 10,
      score: breakdown.levelSuitability?.score ?? 85,
      contribution: breakdown.levelSuitability?.contribution ?? 8.5,
      desc: 'Scope alignment for entry, mid, or senior level expectations',
      icon: <Shield className="w-4 h-4 text-sky-500" />,
      barColor: 'bg-gradient-to-r from-sky-500 to-cyan-400'
    },
    {
      name: 'Company Quality & Reputation',
      weight: 5,
      score: breakdown.companyQuality?.score ?? 85,
      contribution: breakdown.companyQuality?.contribution ?? 4.2,
      desc: 'Evidence-based organization tier (Top Company, Established, Startup, New)',
      icon: <Building2 className="w-4 h-4 text-pink-500" />,
      barColor: 'bg-gradient-to-r from-pink-500 to-rose-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111622] rounded-3xl max-w-xl w-full border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A2234] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Match Score Formula</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {toSafeString(job.title)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {toSafeString(job.companyName)} • {toSafeString(job.companyCategory)}
          </p>
        </div>

        {/* Total Score Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-between mb-6 shadow-lg shadow-purple-500/25">
          <div>
            <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Total AI Relevance Score
            </div>
            <div className="text-4xl font-extrabold text-white mt-0.5">
              {job.matchScore} <span className="text-lg font-normal text-white/80">/ 100</span>
            </div>
          </div>
          <div className="text-right text-xs text-white/90 max-w-[200px] leading-relaxed">
            Weighted calculation across all 6 candidate & market dimensions
          </div>
        </div>

        {/* Factors List */}
        <div className="space-y-4 mb-6">
          {factorItems.map((f, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F31] border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
                  {f.icon}
                  <span>{f.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold">
                    Weight: {f.weight}%
                  </span>
                </div>
                <div className="font-mono text-xs">
                  Score: {f.score}/100 → <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">+{f.contribution} pts</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                {f.desc}
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${f.barColor} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(0, f.score))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#1A2234] text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>
            Candidate suitability dictates 95% of the overall ranking. Company reputation provides a 5% quality boost without displacing a genuinely better-matched opportunity.
          </span>
        </div>
      </div>
    </div>
  );
}
