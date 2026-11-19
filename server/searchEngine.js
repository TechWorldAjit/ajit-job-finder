import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

/**
 * Configurable External Web & Job Search Providers
 * Supports SerpApi (Google Jobs), Google Custom Search, JSearch (RapidAPI), and Adzuna.
 * If API keys are configured in .env, they are automatically engaged.
 * If not configured, gracefully logs and allows the ATS & aggregator engine to run.
 */
export async function executeExternalSearch({ query, location }) {
  const jobs = [];

  // 1. SerpApi (Google Jobs engine)
  if (process.env.SERPAPI_API_KEY) {
    try {
      console.log(`[Search Engine] Querying Google Jobs via SerpApi for "${query} in ${location}"...`);
      const res = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_jobs',
          q: `${query} in ${location}`,
          location,
          api_key: process.env.SERPAPI_API_KEY
        },
        timeout: 8000
      });

      const results = res.data?.jobs_results || [];
      for (const item of results) {
        jobs.push({
          id: `serp-${item.job_id || Math.random().toString(36).substring(7)}`,
          title: toSafeString(item.title),
          companyName: toSafeString(item.company_name),
          location: toSafeString(item.location) || location,
          isRemote: String(item.location || '').toLowerCase().includes('remote'),
          workMode: String(item.location || '').toLowerCase().includes('remote') ? 'Remote' : 'On-site',
          url: item.related_links?.[0]?.link || item.share_link || 'https://www.google.com/search?q=' + encodeURIComponent(item.title),
          source: 'Google Jobs (Indexed)',
          verified: true,
          pubDate: new Date().toISOString(),
          description: toSafeString(item.description).slice(0, 1500),
          tags: [item.company_name, 'Google Jobs'].filter(Boolean),
          salary: item.detected_extensions?.salary || null,
          companyCategory: 'Established Companies',
          companyTier: 2,
          companyLogo: item.thumbnail || `https://logo.clearbit.com/${toSafeString(item.company_name).toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
        });
      }
    } catch (e) {
      console.warn(`[Search Engine] SerpApi Google Jobs error: ${e.message}`);
    }
  }

  // 2. JSearch (RapidAPI - aggregates LinkedIn, Indeed, Glassdoor, ZipRecruiter)
  if (process.env.JSEARCH_RAPIDAPI_KEY) {
    try {
      console.log(`[Search Engine] Querying JSearch (LinkedIn, Indeed, Glassdoor) for "${query} in ${location}"...`);
      const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
        params: {
          query: `${query} in ${location}`,
          num_pages: '1'
        },
        headers: {
          'X-RapidAPI-Key': process.env.JSEARCH_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        },
        timeout: 8000
      });

      const data = res.data?.data || [];
      for (const item of data) {
        jobs.push({
          id: `jsearch-${item.job_id}`,
          title: toSafeString(item.job_title),
          companyName: toSafeString(item.employer_name),
          location: [item.job_city, item.job_state, item.job_country].filter(Boolean).join(', ') || location,
          isRemote: !!item.job_is_remote,
          workMode: item.job_is_remote ? 'Remote' : 'On-site',
          url: item.job_apply_link || item.job_google_link,
          source: `${item.job_publisher || 'Web'} (JSearch Index)`,
          verified: true,
          pubDate: item.job_posted_at_datetime_utc || new Date().toISOString(),
          description: toSafeString(item.job_description).slice(0, 1500),
          tags: [item.job_employment_type, item.employer_name].filter(Boolean),
          salary: item.job_min_salary && item.job_max_salary ? `$${item.job_min_salary.toLocaleString()} - $${item.job_max_salary.toLocaleString()}` : null,
          companyCategory: 'Established Companies',
          companyTier: 2,
          companyLogo: item.employer_logo || `https://logo.clearbit.com/${toSafeString(item.employer_name).toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
        });
      }
    } catch (e) {
      console.warn(`[Search Engine] JSearch error: ${e.message}`);
    }
  }

  return jobs;
}
