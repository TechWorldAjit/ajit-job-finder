import axios from 'axios';
import { COMPANY_REGISTRY } from './companyRegistry.js';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.name || val.location || val.title || JSON.stringify(val);
  return String(val);
}

// In-memory cache for ATS board feeds
let cachedAtsJobs = [];
let lastAtsFetch = 0;
const ATS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

/**
 * Fetch jobs from a single Greenhouse board
 */
async function fetchGreenhouseBoard(company) {
  const jobs = [];
  try {
    const res = await axios.get(`https://boards-api.greenhouse.io/v1/boards/${company.gh}/jobs?content=true`, {
      headers: { 'User-Agent': 'AjitJobFinder-ATS/3.0' },
      timeout: 5000
    });
    const items = res.data?.jobs || [];
    for (const j of items) {
      const locStr = toSafeString(j.location?.name) || 'Not disclosed';
      const isRemote = locStr.toLowerCase().includes('remote') || locStr.toLowerCase().includes('anywhere');
      const workMode = isRemote ? 'Remote' : (locStr.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site');
      const depts = Array.isArray(j.departments) ? j.departments.map(d => toSafeString(d.name)) : [];

      jobs.push({
        id: `gh-${company.gh}-${j.id}`,
        title: toSafeString(j.title),
        companyName: company.name,
        location: locStr,
        isRemote,
        workMode,
        url: j.absolute_url || `https://boards.greenhouse.io/${company.gh}/jobs/${j.id}`,
        source: `${company.name} Careers (Greenhouse ATS)`,
        verified: true,
        pubDate: j.updated_at ? new Date(j.updated_at).toISOString() : new Date().toISOString(),
        description: j.content ? String(j.content).replace(/<[^>]*>/g, ' ').slice(0, 1500) : `${j.title} at ${company.name}`,
        tags: [company.industry, ...depts].filter(Boolean),
        salary: null,
        companyCategory: company.category || 'Top Companies',
        companyTier: company.tier === 'Top Companies' ? 1 : (company.tier === 'Established Companies' ? 2 : 3),
        companyLogo: `https://logo.clearbit.com/${company.logo || `${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}`
      });
    }
  } catch (err) {
    // Board not found or temporary timeout - fail silently
  }
  return jobs;
}

/**
 * Fetch jobs from a single Ashby board
 */
async function fetchAshbyBoard(company) {
  const jobs = [];
  try {
    const res = await axios.get(`https://api.ashbyhq.com/posting-api/job-board/${company.ashby}`, {
      headers: { 'User-Agent': 'AjitJobFinder-ATS/3.0' },
      timeout: 5000
    });
    const items = res.data?.jobs || [];
    for (const j of items) {
      const primaryLoc = toSafeString(j.location);
      const secondaryLocs = Array.isArray(j.secondaryLocations) ? j.secondaryLocations.map(toSafeString).join('; ') : '';
      const fullLoc = [primaryLoc, secondaryLocs].filter(Boolean).join('; ') || 'Not disclosed';
      const isRemote = !!j.isRemote || fullLoc.toLowerCase().includes('remote');
      const workMode = isRemote ? 'Remote' : (fullLoc.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site');

      jobs.push({
        id: `ash-${company.ashby}-${j.id || Math.random().toString(36).substring(7)}`,
        title: toSafeString(j.title),
        companyName: company.name,
        location: fullLoc,
        isRemote,
        workMode,
        url: j.jobUrl || `https://jobs.ashbyhq.com/${company.ashby}`,
        source: `${company.name} Careers (Ashby ATS)`,
        verified: true,
        pubDate: j.publishedAt ? new Date(j.publishedAt).toISOString() : new Date().toISOString(),
        description: j.descriptionPlain ? j.descriptionPlain.slice(0, 1500) : `${j.title} at ${company.name}`,
        tags: [company.industry, toSafeString(j.department), toSafeString(j.employmentType)].filter(Boolean),
        salary: j.compensationTier?.summary || null,
        companyCategory: company.category || 'Top Companies',
        companyTier: company.tier === 'Top Companies' ? 1 : (company.tier === 'Established Companies' ? 2 : 3),
        companyLogo: `https://logo.clearbit.com/${company.logo || `${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}`
      });
    }
  } catch (err) {
    // Fail silently on missing board
  }
  return jobs;
}

/**
 * Fetch jobs from a single Lever board
 */
async function fetchLeverBoard(company) {
  const jobs = [];
  try {
    const res = await axios.get(`https://api.lever.co/v0/postings/${company.lever}?mode=json`, {
      headers: { 'User-Agent': 'AjitJobFinder-ATS/3.0' },
      timeout: 5000
    });
    const items = Array.isArray(res.data) ? res.data : [];
    for (const j of items) {
      const locStr = toSafeString(j.categories?.location) || 'Not disclosed';
      const workplaceType = toSafeString(j.workplaceType).toLowerCase();
      const isRemote = workplaceType === 'remote' || locStr.toLowerCase().includes('remote');
      const workMode = isRemote ? 'Remote' : (workplaceType === 'hybrid' || locStr.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site');

      jobs.push({
        id: `lev-${company.lever}-${j.id}`,
        title: toSafeString(j.text),
        companyName: company.name,
        location: locStr,
        isRemote,
        workMode,
        url: j.hostedUrl || `https://jobs.lever.co/${company.lever}/${j.id}`,
        source: `${company.name} Careers (Lever ATS)`,
        verified: true,
        pubDate: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString(),
        description: j.descriptionPlain ? j.descriptionPlain.slice(0, 1500) : `${j.text} at ${company.name}`,
        tags: [company.industry, toSafeString(j.categories?.commitment), toSafeString(j.categories?.team)].filter(Boolean),
        salary: j.salaryRange?.currency ? `${j.salaryRange.currency}${j.salaryRange.min?.toLocaleString()} - ${j.salaryRange.currency}${j.salaryRange.max?.toLocaleString()}` : null,
        companyCategory: company.category || 'Top Companies',
        companyTier: company.tier === 'Top Companies' ? 1 : (company.tier === 'Established Companies' ? 2 : 3),
        companyLogo: `https://logo.clearbit.com/${company.logo || `${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}`
      });
    }
  } catch (err) {
    // Fail silently
  }
  return jobs;
}

/**
 * Concurrent batch fetcher across all registered ATS companies
 * Processes in chunks of 12 to optimize throughput without hitting rate limits.
 */
export async function fetchAllAtsJobs(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedAtsJobs.length > 0 && (now - lastAtsFetch) < ATS_CACHE_TTL_MS) {
    return cachedAtsJobs;
  }

  console.log(`[ATS Scraper] Initiating live ATS harvest across ${COMPANY_REGISTRY.length} enterprise boards...`);
  const allResults = [];
  const chunkSize = 12;

  for (let i = 0; i < COMPANY_REGISTRY.length; i += chunkSize) {
    const chunk = COMPANY_REGISTRY.slice(i, i + chunkSize);
    const chunkPromises = chunk.map(comp => {
      if (comp.gh) return fetchGreenhouseBoard(comp);
      if (comp.ashby) return fetchAshbyBoard(comp);
      if (comp.lever) return fetchLeverBoard(comp);
      return Promise.resolve([]);
    });

    const results = await Promise.all(chunkPromises);
    for (const r of results) {
      if (Array.isArray(r) && r.length > 0) {
        allResults.push(...r);
      }
    }
  }

  cachedAtsJobs = allResults;
  lastAtsFetch = now;
  console.log(`[ATS Scraper] Successfully harvested ${cachedAtsJobs.length} live jobs with official ATS links!`);
  return cachedAtsJobs;
}
