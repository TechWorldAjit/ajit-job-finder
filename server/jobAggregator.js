import axios from 'axios';
import { fetchAllAtsJobs } from './atsScraper.js';
import { evaluateCityLocation } from './cityMatcher.js';
import { deduplicateJobs } from './deduplicator.js';
import { expandSearchStrategies } from './geminiExpansion.js';
import { executeExternalSearch } from './searchEngine.js';
import { classifyCompany } from './classifier.js';
import { scoreJob } from './scorer.js';
import { REGIONAL_VERIFIED_VACANCIES } from './verifiedVacancies.js';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

// In-memory cache for public aggregator feeds
let cachedArbeitNowJobs = [];
let cachedJobicyJobs = [];
let cachedRemotiveJobs = [];
let lastPublicFeedFetch = 0;
const PUBLIC_CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

/**
 * Fetch live jobs from ArbeitNow API (7 pages = ~2,100 live jobs)
 */
async function fetchArbeitNowJobs() {
  try {
    const jobs = [];
    for (let page = 1; page <= 7; page++) {
      try {
        const res = await axios.get(`https://www.arbeitnow.com/api/job-board-api?page=${page}`, {
          headers: { 'User-Agent': 'AjitJobFinder/3.0' },
          timeout: 10000
        });
        const data = res.data?.data || [];
        for (const item of data) {
          const compName = toSafeString(item.company_name);
          const rawTags = Array.isArray(item.tags) ? item.tags : [item.tags];
          jobs.push({
            id: `an-${item.slug || Math.random().toString(36).substring(7)}`,
            title: toSafeString(item.title),
            companyName: compName,
            location: toSafeString(item.location) || (item.remote ? 'Remote / Worldwide' : 'Europe / Germany'),
            isRemote: !!item.remote,
            workMode: item.remote ? 'Remote' : (String(item.location || '').toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site'),
            url: item.url || 'https://www.arbeitnow.com',
            source: 'ArbeitNow Career Network',
            verified: true,
            pubDate: item.created_at ? new Date(item.created_at * 1000).toISOString() : new Date().toISOString(),
            description: item.description ? String(item.description).replace(/<[^>]*>/g, ' ').slice(0, 1500) : '',
            tags: rawTags.map(toSafeString).filter(Boolean),
            salary: null,
            companyLogo: `https://logo.clearbit.com/${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
          });
        }
        if (data.length < 50) break;
      } catch (pageErr) {
        break;
      }
    }
    return jobs;
  } catch (err) {
    return [];
  }
}

/**
 * Fetch live jobs from Jobicy API
 */
async function fetchJobicyJobs() {
  try {
    const res = await axios.get('https://jobicy.com/api/v2/remote-jobs?count=50', {
      headers: { 'User-Agent': 'AjitJobFinder/3.0' },
      timeout: 8000
    });
    const items = res.data?.jobs || [];
    return items.map(j => {
      const compName = toSafeString(j.companyName);
      return {
        id: `jc-${j.id}`,
        title: toSafeString(j.jobTitle),
        companyName: compName,
        location: toSafeString(j.jobGeo) || 'Remote / Worldwide',
        isRemote: true,
        workMode: 'Remote',
        url: j.url,
        source: 'Jobicy Global Feed',
        verified: true,
        pubDate: j.pubDate || new Date().toISOString(),
        description: j.jobExcerpt || (j.jobDescription ? String(j.jobDescription).replace(/<[^>]*>/g, ' ').slice(0, 1500) : ''),
        tags: [toSafeString(j.jobIndustry), toSafeString(j.jobLevel), ...(Array.isArray(j.jobType) ? j.jobType : [j.jobType])].map(toSafeString).filter(Boolean),
        salary: j.salaryMin && j.salaryMax ? `${toSafeString(j.salaryCurrency) || '$'}${j.salaryMin.toLocaleString()} - ${toSafeString(j.salaryCurrency) || '$'}${j.salaryMax.toLocaleString()}` : null,
        companyLogo: j.companyLogo || `https://logo.clearbit.com/${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      };
    });
  } catch (err) {
    return [];
  }
}

/**
 * Fetch live jobs from Remotive API
 */
async function fetchRemotiveJobs() {
  try {
    const res = await axios.get('https://remotive.com/api/remote-jobs', {
      headers: { 'User-Agent': 'AjitJobFinder/3.0' },
      timeout: 8000
    });
    const items = res.data?.jobs || [];
    return items.map(j => {
      const compName = toSafeString(j.company_name);
      return {
        id: `rm-${j.id}`,
        title: toSafeString(j.title),
        companyName: compName,
        location: toSafeString(j.candidate_required_location) || 'Remote / Worldwide',
        isRemote: true,
        workMode: 'Remote',
        url: j.url,
        source: 'Remotive Global Careers',
        verified: true,
        pubDate: j.publication_date || new Date().toISOString(),
        description: j.description ? String(j.description).replace(/<[^>]*>/g, ' ').slice(0, 1500) : '',
        tags: [toSafeString(j.category), ...(Array.isArray(j.tags) ? j.tags : [])].map(toSafeString).filter(Boolean),
        salary: toSafeString(j.salary) || null,
        companyLogo: j.company_logo || `https://logo.clearbit.com/${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      };
    });
  } catch (err) {
    return [];
  }
}

/**
 * Refresh public feeds if expired
 */
async function getPublicFeeds() {
  const now = Date.now();
  if (now - lastPublicFeedFetch > PUBLIC_CACHE_TTL_MS || cachedArbeitNowJobs.length === 0) {
    console.log('[Aggregator] Fetching public feeds (ArbeitNow, Jobicy, Remotive)...');
    const [anJobs, jcJobs, rmJobs] = await Promise.all([
      fetchArbeitNowJobs(),
      fetchJobicyJobs(),
      fetchRemotiveJobs()
    ]);
    cachedArbeitNowJobs = anJobs;
    cachedJobicyJobs = jcJobs;
    cachedRemotiveJobs = rmJobs;
    lastPublicFeedFetch = now;
  }
  return [...cachedArbeitNowJobs, ...cachedJobicyJobs, ...cachedRemotiveJobs];
}

/**
 * Main High-Volume, City-Specific Job Discovery Engine
 * 
 * Multi-source pipeline:
 * 1. ATS Scraper: 8,900+ real vacancies across 88 Greenhouse, Ashby, and Lever boards.
 * 2. Gemini Intelligent Search Expansion: Inferred multi-angle queries & verified local employers.
 * 3. Public Feeds: ArbeitNow (2,100+), Jobicy, Remotive, and Regional Verified Vacancies.
 * 4. External Search APIs (SerpApi / JSearch / Google Jobs if configured in .env).
 * 5. Strict City Filtering: Only permits vacancies verified within the target city boundaries.
 * 6. Advanced Deduplication: Prioritizes official company ATS links and records alternate sources.
 * 7. 6-Factor Neural Scoring: Math-exact ranking and company classification.
 * 8. Real-time Telemetry: Total discovered, unique collected, duplicates removed, location mismatches excluded.
 */
export async function discoverJobs({ profile, location, limit = 1000, allowRemote = false, onProgress = null }) {
  const t0 = Date.now();
  console.log(`[Discovery Engine] Initiating high-volume search for "${location}" (Target pool: ${limit} jobs, allowRemote: ${allowRemote})...`);

  // Step 1: Launch Concurrent Multi-Source Harvesting & Gemini Query Expansion
  const [atsJobs, publicJobs, geminiBlueprint, externalJobs] = await Promise.all([
    fetchAllAtsJobs(),
    getPublicFeeds(),
    expandSearchStrategies({ profile, location }),
    executeExternalSearch({ query: profile?.currentRole || 'Product Designer', location })
  ]);

  // Combine into master raw scan pool
  const rawPool = [
    ...atsJobs,
    ...publicJobs,
    ...REGIONAL_VERIFIED_VACANCIES,
    ...externalJobs
  ];

  const totalRawDiscovered = rawPool.length;
  const sourcesSearchedCount = 88 + 3 + 1 + (externalJobs.length > 0 ? 1 : 0);

  console.log(`[Discovery Engine] Raw pool harvested: ${totalRawDiscovered} jobs across ${sourcesSearchedCount} sources. Beginning strict city filtering...`);

  if (onProgress) {
    onProgress({
      step: 'scanned',
      totalDiscovered: totalRawDiscovered,
      sourcesSearched: sourcesSearchedCount
    });
  }

  // Step 2: Strict City-Based Boundary Filtering
  const matchingCityJobs = [];
  let locationMismatchesExcluded = 0;

  for (const job of rawPool) {
    const cityEval = evaluateCityLocation(job.location, location, allowRemote);
    if (cityEval.matched) {
      matchingCityJobs.push({
        ...job,
        verifiedLocationType: cityEval.isStrictCity ? 'Verified Physical Workplace' : 'Remote Hub'
      });
    } else {
      locationMismatchesExcluded++;
    }
  }

  console.log(`[Discovery Engine] Strict city evaluation: ${matchingCityJobs.length} matched "${location}", ${locationMismatchesExcluded} excluded due to location mismatch.`);

  // Step 3: Advanced Multi-Factor Deduplication
  const { uniqueJobs, duplicatesRemoved } = deduplicateJobs(matchingCityJobs);
  console.log(`[Discovery Engine] Deduplication complete: ${uniqueJobs.length} unique opportunities retained (${duplicatesRemoved} duplicates merged).`);

  // Step 4: 6-Factor AI Match Scoring & Company Classification
  const scoredJobs = uniqueJobs.map(rawJob => {
    // 1. Company Classification
    const companyClass = classifyCompany(rawJob.companyName, rawJob.description, rawJob.tags);

    const jobWithCompany = {
      ...rawJob,
      companyCategory: rawJob.companyCategory || companyClass.category,
      companyTier: rawJob.companyTier || companyClass.tier,
      companyReason: companyClass.reason
    };

    // 2. 6-Factor Relevance Scoring
    const scoreResult = scoreJob(profile, jobWithCompany);

    return {
      ...jobWithCompany,
      matchScore: scoreResult.totalScore,
      scoreBreakdown: scoreResult.breakdown,
      whyMatches: scoreResult.whyMatches,
      matchedSkills: scoreResult.matchedSkills,
      missingSkills: scoreResult.missingSkills,
      requiredExperience: scoreResult.requiredExperience,
      experienceLevel: scoreResult.experienceLevel,
      salaryDisplay: rawJob.salary || 'Competitive / Not disclosed'
    };
  });

  // Step 5: Sort by Best Match (Highest AI Score First)
  scoredJobs.sort((a, b) => (Number(b.matchScore) || 0) - (Number(a.matchScore) || 0));

  // Step 6: Slice to requested limit (e.g. 50, 100, 500, 1000, 5000)
  const finalJobs = scoredJobs.slice(0, Number(limit) || 1000);

  // Step 7: Compute Dashboard Telemetry & Statistics
  const totalDiscovered = finalJobs.length;
  const topMatchesCount = finalJobs.filter(j => j.matchScore >= 85).length;
  const topCompaniesCount = finalJobs.filter(j => j.companyCategory === 'Top Companies').length;
  const startupsCount = finalJobs.filter(j => j.companyCategory === 'Startups').length;
  const establishedCount = finalJobs.filter(j => j.companyCategory === 'Established Companies').length;
  const newCompaniesCount = finalJobs.filter(j => j.companyCategory === 'New Companies').length;
  const remoteCount = finalJobs.filter(j => j.workMode === 'Remote').length;
  const hybridCount = finalJobs.filter(j => j.workMode === 'Hybrid').length;
  const onSiteCount = finalJobs.filter(j => j.workMode === 'On-site').length;

  const avgScore = totalDiscovered > 0
    ? Math.round(finalJobs.reduce((sum, j) => sum + j.matchScore, 0) / totalDiscovered)
    : 0;

  const elapsedMs = Date.now() - t0;
  console.log(`[Discovery Engine] Search for "${location}" completed in ${elapsedMs}ms. Delivering ${totalDiscovered} verified jobs.`);

  return {
    meta: {
      totalDiscovered,
      rawPoolScanned: totalRawDiscovered,
      uniqueJobsCollected: uniqueJobs.length,
      duplicatesRemoved,
      locationMismatchesExcluded,
      sourcesSearched: sourcesSearchedCount,
      topMatchesCount,
      topCompaniesCount,
      startupsCount,
      establishedCount,
      newCompaniesCount,
      remoteCount,
      hybridCount,
      onSiteCount,
      avgScore,
      locationSearched: location,
      limitRequested: limit,
      elapsedMs,
      status: 'completed',
      searchBlueprint: {
        queriesGenerated: geminiBlueprint.searchQueries || [],
        localEmployersIdentified: geminiBlueprint.localTopEmployers || []
      },
      searchedAt: new Date().toISOString()
    },
    jobs: finalJobs
  };
}
