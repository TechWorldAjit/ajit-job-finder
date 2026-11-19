import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, ArrowRight, Layers, Cpu, Palette, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileUpload({
  onProfileLoaded,
  sampleProfiles = [],
  isLoading,
  error
}) {
  const [activeTab, setActiveTab] = useState('samples'); // default to samples
  const [pastedText, setPastedText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelected(files[0]);
    }
  };

  const handleFileSelected = async (file) => {
    setSelectedFileName(file.name);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }
      onProfileLoaded(data.profile);
    } catch (err) {
      alert(err.message || 'Error uploading file');
    }
  };

  const handleParseText = async () => {
    if (!pastedText.trim()) return;
    try {
      const res = await fetch('/api/profile/parse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pastedText })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }
      onProfileLoaded(data.profile);
    } catch (err) {
      alert(err.message || 'Error analyzing text');
    }
  };

  const getProfileGradient = (badge) => {
    switch (badge) {
      case 'Design & UX':
        return {
          gradient: 'from-pink-500/10 via-purple-500/10 to-indigo-500/10 hover:border-pink-500/60',
          badgeCls: 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800/60',
          icon: <Palette className="w-3.5 h-3.5 text-pink-500" />
        };
      case 'Engineering':
        return {
          gradient: 'from-indigo-500/10 via-blue-500/10 to-cyan-500/10 hover:border-indigo-500/60',
          badgeCls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
          icon: <Cpu className="w-3.5 h-3.5 text-indigo-500" />
        };
      case 'AI & Data Science':
        return {
          gradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10 hover:border-emerald-500/60',
          badgeCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
          icon: <Layers className="w-3.5 h-3.5 text-emerald-500" />
        };
      case 'Marketing & Strategy':
        return {
          gradient: 'from-amber-500/10 via-orange-500/10 to-rose-500/10 hover:border-amber-500/60',
          badgeCls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          icon: <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
        };
      default:
        return {
          gradient: 'from-purple-500/10 to-indigo-500/10 hover:border-purple-500/60',
          badgeCls: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" />
        };
    }
  };

  return (
    <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-indigo-500/5 p-6 sm:p-10 mb-8 transition-all">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Step 1: Upload Profile or Select Demo Candidate</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Let AI Understand Your Capabilities
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Upload your resume or pick a demo profile. Our intelligent engine maps your skills to
          <span className="font-bold text-slate-900 dark:text-white"> matching career opportunities</span>—<span className="font-semibold text-indigo-600 dark:text-indigo-400">no manual job title required</span>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-[#1A2234] rounded-2xl space-x-1 text-xs font-bold shadow-inner">
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'samples'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⭐ 1-Click Demo Profiles
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#253047] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upload Resume (PDF, DOCX, TXT)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'text'
                ? 'bg-white dark:bg-[#253047] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paste Text Knowledge Base
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-xl mx-auto mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: 1-Click Demo Profiles */}
      {activeTab === 'samples' && (
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Choose a pre-configured professional profile:</span>
            </h3>
            <span className="text-xs text-slate-400">Click any card to test immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleProfiles.map((p) => {
              const meta = getProfileGradient(p.badge);
              return (
                <button
                  key={p.id}
                  onClick={() => onProfileLoaded(p)}
                  className={`group text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-gradient-to-br ${meta.gradient} dark:bg-[#131A29] hover:shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${meta.badgeCls}`}>
                      {meta.icon}
                      <span>{p.badge}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {p.yearsOfExperience}y exp
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {p.name || p.fullName}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate mb-3">
                    {p.currentRole}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(p.skills || []).slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {typeof s === 'object' ? s.name || s.title : s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-end text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Select Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Upload File */}
      {activeTab === 'upload' && (
        <div className="max-w-xl mx-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/60 dark:bg-[#161F31]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {selectedFileName ? `Selected: ${selectedFileName}` : 'Drop your resume file here, or click to browse'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Supports PDF, DOCX, or plain text resumes. Max file size: 15MB.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-500/20">
              Browse Files
            </span>
          </div>

          {isLoading && (
            <div className="mt-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center space-x-3 text-indigo-800 dark:text-indigo-200 text-xs font-semibold animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Analyzing profile & discovering multi-category job titles with Gemini AI...</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Paste Raw Text */}
      {activeTab === 'text' && (
        <div className="max-w-xl mx-auto">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Paste Resume, LinkedIn Summary, or Knowledge Base:
          </label>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={7}
            placeholder="Paste your professional experience, skills, roles, tools (e.g., Photoshop, Figma, Python, React, SEO), and educational background here..."
            className="w-full text-xs font-mono p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 dark:bg-[#161F31] text-slate-800 dark:text-slate-100 resize-y"
          ></textarea>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleParseText}
              disabled={isLoading || !pastedText.trim()}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze with Gemini AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
