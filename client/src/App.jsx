import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import ProfileUpload from './components/ProfileUpload.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import SearchControls from './components/SearchControls.jsx';
import StatsDashboard from './components/StatsDashboard.jsx';
import FilterChips from './components/FilterChips.jsx';
import SortBar from './components/SortBar.jsx';
import JobCard from './components/JobCard.jsx';
import ScoreBreakdownModal from './components/ScoreBreakdownModal.jsx';
import SavedJobsDrawer from './components/SavedJobsDrawer.jsx';
import Pagination from './components/Pagination.jsx';
import SearchProgress from './components/SearchProgress.jsx';
import { storage } from './utils/storage.js';
import { Sparkles, Briefcase, Search, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

export default function App() {
  // Theme State (Dark mode default with smooth light mode support)
  const [theme, setTheme] = useState(() => storage.getTheme());

  useEffect(() => {
    storage.setTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    storage.setTheme(next);
  };

  // Candidate Profile State
  const [profile, setProfile] = useState(() => storage.getProfile());
  const [isParsingProfile, setIsParsingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Search State
  const [location, setLocation] = useState('London');
  const [limit, setLimit] = useState(1000); // 1,000 jobs default per specification
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchMeta, setSearchMeta] = useState(null);
  const [allDiscoveredJobs, setAllDiscoveredJobs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Interactive Filter & Sort State
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('best_match');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Modals & Drawers
  const [selectedJobForBreakdown, setSelectedJobForBreakdown] = useState(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState(() => storage.getSavedJobs());
  const [appliedJobs, setAppliedJobs] = useState(() => storage.getAppliedJobs());


  // Save profile to storage whenever updated
  const handleProfileLoaded = (newProfile) => {
    setProfile(newProfile);
    storage.saveProfile(newProfile);
    setProfileError(null);
  };

  const handleResetProfile = () => {
    if (confirm('Change or replace current candidate profile?')) {
      setProfile(null);
      storage.clearProfile();
      setAllDiscoveredJobs([]);
      setSearchMeta(null);
      setHasSearched(false);
    }
  };

  // Perform Job Discovery
  const handleSearchJobs = async () => {
    if (!profile) {
      setSearchError('Candidate profile required. Please upload or select a candidate first.');
      return;
    }
    if (!location.trim()) {
      setSearchError('Location is required.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setCurrentPage(1);

    try {
      const allowRemote = activeFilters.includes('remote') || location.toLowerCase().includes('remote');
      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          location,
          limit,
          allowRemote
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to discover jobs');
      }

      setSearchMeta(data.meta);
      setAllDiscoveredJobs(data.jobs || []);
      setHasSearched(true);
    } catch (err) {
      console.error('Job search error:', err);
      setSearchError(err.message || 'Error occurred while discovering jobs.');
    } finally {
      setIsSearching(false);
    }
  };

  // Saved / Applied Handlers
  const handleToggleSaveJob = (job) => {
    const updated = storage.toggleSaveJob(job);
    setSavedJobs(updated);
  };

  const handleToggleAppliedJob = (job) => {
    const updated = storage.toggleAppliedJob(job);
    setAppliedJobs(updated);
  };

  // Dynamic Filter Handlers
  const handleToggleFilter = (filterId) => {
    setCurrentPage(1);
    if (filterId === 'all') {
      setActiveFilters([]);
      return;
    }

    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter(f => f !== filterId));
    } else {
      setActiveFilters([...activeFilters.filter(f => f !== 'all'), filterId]);
    }
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setCurrentPage(1);
  };

  // Compute dynamic filter counts across the currently discovered jobs
  const filterCounts = useMemo(() => {
    const counts = {
      all: allDiscoveredJobs.length,
      top_matches: 0,
      top_companies: 0,
      startups: 0,
      established: 0,
      new_companies: 0,
      remote: 0,
      hybrid: 0,
      onsite: 0,
      entry: 0,
      mid: 0,
      senior: 0
    };

    for (const job of allDiscoveredJobs) {
      const score = Number(job.matchScore) || 0;
      const cat = toSafeString(job.companyCategory);
      const mode = toSafeString(job.workMode);
      const lvl = toSafeString(job.experienceLevel);

      if (score >= 85) counts.top_matches++;
      if (cat === 'Top Companies') counts.top_companies++;
      if (cat === 'Startups') counts.startups++;
      if (cat === 'Established Companies') counts.established++;
      if (cat === 'New Companies') counts.new_companies++;
      if (mode === 'Remote') counts.remote++;
      if (mode === 'Hybrid') counts.hybrid++;
      if (mode === 'On-site') counts.onsite++;
      if (lvl === 'Entry Level') counts.entry++;
      if (lvl === 'Mid-Level') counts.mid++;
      if (lvl === 'Senior Level') counts.senior++;
    }

    return counts;
  }, [allDiscoveredJobs]);

  // Filter and Sort Pipeline
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...allDiscoveredJobs];

    // Apply Active Filters
    if (activeFilters.length > 0 && !activeFilters.includes('all')) {
      result = result.filter(job => {
        return activeFilters.every(filterId => {
          const score = Number(job.matchScore) || 0;
          const cat = toSafeString(job.companyCategory);
          const mode = toSafeString(job.workMode);
          const lvl = toSafeString(job.experienceLevel);

          switch (filterId) {
            case 'top_matches':
              return score >= 85;
            case 'top_companies':
              return cat === 'Top Companies';
            case 'startups':
              return cat === 'Startups';
            case 'established':
              return cat === 'Established Companies';
            case 'new_companies':
              return cat === 'New Companies';
            case 'remote':
              return mode === 'Remote';
            case 'hybrid':
              return mode === 'Hybrid';
            case 'onsite':
              return mode === 'On-site';
            case 'entry':
              return lvl === 'Entry Level';
            case 'mid':
              return lvl === 'Mid-Level';
            case 'senior':
              return lvl === 'Senior Level';
            default:
              return true;
          }
        });
      });
    }

    // Apply Sorting
    result.sort((a, b) => {
      const scoreA = Number(a.matchScore) || 0;
      const scoreB = Number(b.matchScore) || 0;

      switch (sortBy) {
        case 'best_companies': {
          const tierA = Number(a.companyTier) || 3;
          const tierB = Number(b.companyTier) || 3;
          if (tierA !== tierB) return tierA - tierB;
          return scoreB - scoreA;
        }
        case 'company_name': {
          return toSafeString(a.companyName).localeCompare(toSafeString(b.companyName));
        }
        case 'highest_salary': {
          const salA = a.salary ? 1 : 0;
          const salB = b.salary ? 1 : 0;
          if (salA !== salB) return salB - salA;
          return scoreB - scoreA;
        }
        case 'newest_jobs': {
          const dateA = new Date(a.pubDate || 0).getTime();
          const dateB = new Date(b.pubDate || 0).getTime();
          return dateB - dateA;
        }
        case 'lowest_experience': {
          const order = { 'Entry Level': 1, 'Mid-Level': 2, 'Senior Level': 3 };
          const levelA = order[a.experienceLevel] || 2;
          const levelB = order[b.experienceLevel] || 2;
          if (levelA !== levelB) return levelA - levelB;
          return scoreB - scoreA;
        }
        case 'best_match':
        default:
          return scoreB - scoreA;
      }
    });

    return result;
  }, [allDiscoveredJobs, activeFilters, sortBy]);

  // Paginated View Slice
  const totalMatching = filteredAndSortedJobs.length;
  const totalPages = Math.ceil(totalMatching / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage, itemsPerPage]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* Sticky Modern Header */}
      <Header
        savedJobsCount={savedJobs.length}
        appliedJobsCount={appliedJobs.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        hasProfile={!!profile}
        onResetProfile={handleResetProfile}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Step 1: Candidate Profile / Knowledge Base */}
        {!profile ? (
          <ProfileUpload
            onProfileLoaded={handleProfileLoaded}
            isLoading={isParsingProfile}
            error={profileError}
          />
        ) : (
          <ProfileCard
            profile={profile}
            onEditProfile={handleResetProfile}
          />
        )}

        {/* Step 2: Search Controls (Location + Result Count) */}
        <SearchControls
          location={location}
          setLocation={setLocation}
          limit={limit}
          setLimit={setLimit}
          onSearch={handleSearchJobs}
          isSearching={isSearching}
          hasProfile={!!profile}
        />

        {searchError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Modern Animated Search Loading State */}
        {isSearching && (
          <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-12 text-center mb-8 shadow-xl shadow-indigo-500/5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/25 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Discovering Vacancies in {location}...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Scanning thousands of live vacancies from ArbeitNow, Jobicy, Remotive, and official career ATS platforms.
            </p>
            {/* Animated step pills */}
            <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Multi-Category Titles Inferred</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 animate-pulse shadow-2xs">
                <span>Aggregating 2,000+ Opportunities</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
                <span>6-Factor Neural Relevance Scoring</span>
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Results Experience (Stats + Filters + Job Cards) */}
        {hasSearched && !isSearching && (
          <div>
            {/* Search Progress & Result Transparency Telemetry Indicator */}
            <SearchProgress
              meta={searchMeta}
              isSearching={isSearching}
              location={location}
              limit={limit}
            />

            {/* Dashboard Telemetry Stats */}
            <StatsDashboard meta={searchMeta} />

            {/* Dynamic Interactive Filter Chips */}
            <FilterChips
              activeFilters={activeFilters}
              onToggleFilter={handleToggleFilter}
              onClearFilters={handleClearFilters}
              filterCounts={filterCounts}
            />

            {/* Sort Bar */}
            <SortBar
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalMatching={totalMatching}
              totalDiscovered={searchMeta?.totalDiscovered || allDiscoveredJobs.length}
            />

            {/* Job Cards Grid / List */}
            {paginatedJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onOpenScoreBreakdown={(selected) => setSelectedJobForBreakdown(selected)}
                    isSaved={savedJobs.some(s => s.id === job.id)}
                    onToggleSave={handleToggleSaveJob}
                    isApplied={appliedJobs.some(a => a.id === job.id)}
                    onToggleApplied={handleToggleAppliedJob}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-12 text-center shadow-xs">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-[#1A2234] flex items-center justify-center text-slate-400 mb-3">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  No vacancies match your active filters
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Try clearing some filter criteria to expand the results pool.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              itemsPerPage={itemsPerPage}
              totalItems={totalMatching}
            />
          </div>
        )}

        {/* Initial Empty State before Searching */}
        {!hasSearched && !isSearching && profile && (
          <div className="bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-8 sm:p-12 text-center shadow-lg shadow-indigo-500/5 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/25">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Ready to Discover Career Opportunities
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              Your profile capability has been mapped into {(profile.suitableJobTitles || []).length || 6} target job categories.
              Select your desired location above and launch the intelligent discovery engine.
            </p>
            <button
              onClick={handleSearchJobs}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-xs font-extrabold shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Discover Opportunities in {location}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#0A0D14]/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white">Ajit Job Finder</span> • AI-Powered Smart Career Discovery Engine
          </div>
          <div className="flex items-center space-x-4 text-slate-400 text-[11px]">
            <span>Official ATS Links</span>
            <span>•</span>
            <span>6-Factor Neural Relevance</span>
            <span>•</span>
            <span>Zero Manual Title Required</span>
          </div>
        </div>
      </footer>

      {/* Score Breakdown Modal */}
      {selectedJobForBreakdown && (
        <ScoreBreakdownModal
          job={selectedJobForBreakdown}
          onClose={() => setSelectedJobForBreakdown(null)}
        />
      )}

      {/* Saved / Applied Jobs Slide-over Drawer */}
      <SavedJobsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedJobs={savedJobs}
        appliedJobs={appliedJobs}
        onRemoveSaved={handleToggleSaveJob}
        onRemoveApplied={handleToggleAppliedJob}
      />
    </div>
  );
}
