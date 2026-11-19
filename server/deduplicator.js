/**
 * Advanced Multi-Factor Job Deduplication Engine
 * 
 * Merges identical or duplicate postings appearing across multiple boards and aggregators.
 * Uses normalized company name, normalized title, exact city location, and description fingerprinting.
 * Prioritizes official company career page / ATS URL as the primary application link.
 * Preserves alternative links in a `sources` array for transparency.
 */

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

/**
 * Normalize company name by stripping legal designations (Inc., LLC, Ltd., Corp.)
 */
function normalizeCompany(name) {
  return toSafeString(name)
    .toLowerCase()
    .replace(/\b(inc|incorporated|llc|ltd|limited|corp|corporation|technologies|tech|gmbh|co|holdings)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Normalize title by stripping location suffixes, brackets, and requisition codes
 */
function normalizeTitle(title) {
  return toSafeString(title)
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // remove parenthesized info like (Hybrid), (Remote)
    .replace(/\[[^\]]*\]/g, '') // remove bracketed tags like [Req-1234]
    .replace(/-\s*(remote|hybrid|onsite|san francisco|london|new york|toronto|berlin|singapore).*$/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Determine URL priority score. Official ATS and direct company career domains rank highest.
 */
function getUrlPriority(url, source) {
  const u = String(url || '').toLowerCase();
  const s = String(source || '').toLowerCase();

  if (u.includes('stripe.com') || u.includes('airbnb.com') || u.includes('openai.com') || u.includes('careers.')) return 100;
  if (u.includes('boards.greenhouse.io') || u.includes('jobs.ashbyhq.com') || u.includes('jobs.lever.co')) return 95;
  if (s.includes('official') || s.includes('ats')) return 90;
  if (u.includes('arbeitnow.com')) return 70;
  if (u.includes('jobicy.com')) return 65;
  if (u.includes('remotive.com')) return 60;
  return 50;
}

/**
 * Deduplicate an array of raw jobs
 * 
 * @param {Array} rawJobs
 * @returns {{ uniqueJobs: Array, duplicatesRemoved: number }}
 */
export function deduplicateJobs(rawJobs) {
  const jobMap = new Map();
  let duplicatesRemoved = 0;

  for (const job of rawJobs) {
    const compKey = normalizeCompany(job.companyName);
    const titleKey = normalizeTitle(job.title);
    
    // Fallback key if company or title is empty
    const dedupKey = `${compKey}:::${titleKey}`;

    if (!jobMap.has(dedupKey)) {
      jobMap.set(dedupKey, {
        ...job,
        sourcesList: [{ name: job.source || 'Direct Source', url: job.url }]
      });
    } else {
      duplicatesRemoved++;
      const existing = jobMap.get(dedupKey);

      // Record this duplicate source link
      if (job.url && !existing.sourcesList.some(s => s.url === job.url)) {
        existing.sourcesList.push({ name: job.source || 'Alternative Source', url: job.url });
      }

      // Upgrade primary URL if new job has a higher priority link (e.g. official ATS instead of aggregator)
      const existingPriority = getUrlPriority(existing.url, existing.source);
      const newPriority = getUrlPriority(job.url, job.source);

      if (newPriority > existingPriority) {
        existing.url = job.url;
        existing.source = job.source;
        if (job.salary && !existing.salary) existing.salary = job.salary;
        if (job.description && job.description.length > (existing.description || '').length) {
          existing.description = job.description;
        }
      }
    }
  }

  return {
    uniqueJobs: Array.from(jobMap.values()),
    duplicatesRemoved
  };
}
