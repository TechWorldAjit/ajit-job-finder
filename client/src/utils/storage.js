/**
 * Persistent Storage Utilities for candidate profile, saved jobs, applied jobs, and theme
 */

const PROFILE_KEY = 'ajit_job_finder_profile';
const SAVED_JOBS_KEY = 'ajit_job_finder_saved_jobs';
const APPLIED_JOBS_KEY = 'ajit_job_finder_applied_jobs';
const THEME_KEY = 'ajit_job_finder_theme';

export const storage = {
  getTheme: () => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved || 'dark'; // Hacker dark mode by default!
    } catch (e) {
      return 'dark';
    }
  },
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  },

  getProfile: () => {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Storage read failed:', e);
      return null;
    }
  },
  saveProfile: (profile) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  },
  clearProfile: () => {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch (e) {}
  },

  getSavedJobs: () => {
    try {
      const data = localStorage.getItem(SAVED_JOBS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  toggleSaveJob: (job) => {
    try {
      const current = storage.getSavedJobs();
      const exists = current.some(j => j.id === job.id);
      let updated;
      if (exists) {
        updated = current.filter(j => j.id !== job.id);
      } else {
        updated = [job, ...current];
      }
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return [];
    }
  },

  getAppliedJobs: () => {
    try {
      const data = localStorage.getItem(APPLIED_JOBS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  toggleAppliedJob: (job) => {
    try {
      const current = storage.getAppliedJobs();
      const exists = current.some(j => j.id === job.id);
      let updated;
      if (exists) {
        updated = current.filter(j => j.id !== job.id);
      } else {
        updated = [{ ...job, appliedAt: new Date().toISOString() }, ...current];
      }
      localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return [];
    }
  }
};
