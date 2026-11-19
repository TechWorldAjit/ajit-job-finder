import { callGemini } from './gemini.js';

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.title || val.name || val.label || JSON.stringify(val);
  return String(val);
}

/**
 * Clean and parse JSON from Gemini text response
 */
function safeJsonParse(rawText) {
  let cleaned = String(rawText || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// In-memory cache for search expansions to minimize API latency
const expansionCache = new Map();

/**
 * Intelligent Search Expansion using Gemini
 * 
 * Automatically analyzes candidate profile and requested city to produce:
 * 1. 8-12 diverse multi-angle search queries across titles, seniorities, and platform searches.
 * 2. 15-25 top verified employers and high-growth startups with active offices in that city.
 * 3. Targeted ATS queries (Greenhouse, Ashby, Lever).
 */
export async function expandSearchStrategies({ profile, location }) {
  const role = toSafeString(profile?.currentRole || 'Professional');
  const targetTitles = Array.isArray(profile?.suitableJobTitles) ? profile.suitableJobTitles.map(toSafeString) : [role];
  const skills = Array.isArray(profile?.skills) ? profile.skills.slice(0, 8).map(toSafeString) : [];
  const cacheKey = `${location.toLowerCase().trim()}:::${role.toLowerCase().trim()}`;

  if (expansionCache.has(cacheKey)) {
    return expansionCache.get(cacheKey);
  }

  const prompt = `
You are an expert recruitment search strategist and career discovery engine.
Target City / Location: "${location}"
Candidate Profile:
- Primary Role: ${role}
- AI-Mapped Target Titles: ${JSON.stringify(targetTitles)}
- Core Skills & Tooling: ${JSON.stringify(skills)}
- Seniority: ${profile?.experienceLevel || 'Mid-Level'}

Generate an extensive multi-angle search discovery blueprint in JSON format:
{
  "searchQueries": [
    "Array of 8-12 distinct, non-redundant search queries combining specific job titles, seniority levels (Junior, Mid, Senior, Lead, Staff), core technologies, and '${location}'"
  ],
  "localTopEmployers": [
    "Array of 15-25 verified companies and high-velocity startups with confirmed physical offices or headquarters in ${location} hiring in this discipline"
  ],
  "platformQueries": [
    "site:boards.greenhouse.io '${location}' '${role}'",
    "site:jobs.ashbyhq.com '${location}'",
    "site:jobs.lever.co '${location}'"
  ]
}
`;

  try {
    const rawResponse = await callGemini(prompt, 'application/json', 0.2);
    const parsed = safeJsonParse(rawResponse);
    
    const result = {
      searchQueries: Array.isArray(parsed.searchQueries) ? parsed.searchQueries : [],
      localTopEmployers: Array.isArray(parsed.localTopEmployers) ? parsed.localTopEmployers : [],
      platformQueries: Array.isArray(parsed.platformQueries) ? parsed.platformQueries : []
    };

    expansionCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[Gemini Expansion] Falling back to rule-based expansion: ${err.message}`);
    
    // Deterministic rule-based fallback if Gemini API call times out
    const fallback = {
      searchQueries: [
        `${role} jobs in ${location}`,
        `Senior ${role} in ${location}`,
        `Lead ${role} in ${location}`,
        `Junior ${role} in ${location}`,
        ...(targetTitles.slice(0, 4).map(t => `${t} in ${location}`)),
        `${skills[0] || 'Tech'} ${role} in ${location}`,
        `${role} at major technology companies in ${location}`
      ],
      localTopEmployers: [
        'Stripe', 'Airbnb', 'Google', 'Apple', 'Meta', 'Figma', 'Notion', 'OpenAI',
        'Anthropic', 'Datadog', 'Cloudflare', 'Reddit', 'Pinterest', 'DoorDash'
      ],
      platformQueries: [
        `site:boards.greenhouse.io ${location} ${role}`,
        `site:jobs.ashbyhq.com ${location}`,
        `site:jobs.lever.co ${location}`
      ]
    };

    expansionCache.set(cacheKey, fallback);
    return fallback;
  }
}
