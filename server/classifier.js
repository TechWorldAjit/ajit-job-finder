/**
 * Company Classification Engine
 * Classifies companies into:
 * 1. Top Companies: Globally recognised companies and established industry leaders.
 * 2. Established Companies: Reputable organisations with an established business presence.
 * 3. Startups: Early-stage or growth-stage businesses.
 * 4. New Companies: Recently founded or newly emerging organisations.
 */

// Well-known globally recognised leaders and tier-1 tech/industry leaders
const TOP_COMPANIES = new Set([
  'google', 'alphabet', 'apple', 'microsoft', 'amazon', 'meta', 'facebook',
  'netflix', 'nvidia', 'adobe', 'stripe', 'airbnb', 'uber', 'spotify',
  'salesforce', 'oracle', 'intel', 'ibm', 'cisco', 'sap', 'palantir',
  'databricks', 'snowflake', 'openai', 'anthropic', 'canva', 'figma',
  'atlassian', 'slack', 'shopify', 'zoom', 'twitter', 'x', 'linkedin',
  'goldman sachs', 'jpmorgan chase', 'morgan stanley', 'bloomberg', 'blackrock',
  'mckinsey', 'boston consulting group', 'bain', 'disney', 'sony',
  'tesla', 'spacex', 'cloudflare', 'datadog', 'mongodb', 'gitlab', 'github',
  'pinterest', 'snap', 'bytedance', 'tiktok', 'tencent', 'alibaba',
  'paypal', 'square', 'block', 'intuit', 'autodesk', 'qualcomm',
  'workday', 'servicenow', 'siemens', 'bosch', 'philips', 'bmw', 'mercedes-benz'
]);

// Well-known established businesses with long-standing operations
const ESTABLISHED_COMPANIES = new Set([
  'bbc', 'reuters', 'guardian', 'cnn', 'red hat', 'automattic', 'mozilla',
  'canonical', 'suse', 'elastic', 'hashicorp', 'twilio', 'zendesk',
  'hubspot', 'mailchimp', 'godaddy', 'dropbox', 'box', 'asana', 'monday.com',
  'intercom', 'basecamp', 'buffer', 'invision', 'squarespace', 'wix',
  'klarna', 'revolut', 'monzo', 'wise', 'n26', 'adyen', 'chime',
  'accenture', 'deloitte', 'pwc', 'ey', 'kpmg', 'capgemini', 'cognizant',
  'infosys', 'tcs', 'wipro', 'vodafone', 'orange', 'telefonica', 'bt',
  'deutsche telekom', 't-mobile', 'verizon', 'at&t', 'mitre media', 'right search'
]);

function toStr(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.title || val.name || val.label || val.value || val.tag || Object.values(val).filter(v => typeof v === 'string').join(' ') || '';
  }
  return String(val);
}

/**
 * Classify a company based on name, job tags, and description signals
 */
export function classifyCompany(companyName, description = '', tags = []) {
  const cleanName = toStr(companyName).toLowerCase().trim().replace(/^(the|inc\.|llc|ltd|gmbh|ag|corp|co\.)\s+/i, '').replace(/\s+(inc\.|llc|ltd|gmbh|ag|corp|co\.)$/i, '');
  if (!cleanName) {
    return {
      category: 'Established Companies',
      reason: 'Standard verified employer listing'
    };
  }

  const descLower = toStr(description).toLowerCase();
  const rawTags = Array.isArray(tags) ? tags : [tags];
  const allTags = rawTags.map(toStr).filter(Boolean).join(' ').toLowerCase();

  // Check direct Top Company match
  for (const top of TOP_COMPANIES) {
    if (cleanName === top || cleanName.includes(top)) {
      return {
        category: 'Top Companies',
        tier: 1,
        reason: 'Globally recognised enterprise leader with industry-defining brand and market capitalisation.'
      };
    }
  }

  // Check direct Established Company match
  for (const est of ESTABLISHED_COMPANIES) {
    if (cleanName === est || cleanName.includes(est)) {
      return {
        category: 'Established Companies',
        tier: 2,
        reason: 'Reputable organisation with strong international business presence and proven track record.'
      };
    }
  }

  // Analyze textual evidence in description & tags
  const isSeedOrNew =
    descLower.includes('founded in 2025') ||
    descLower.includes('founded in 2026') ||
    descLower.includes('founded in 2024') ||
    descLower.includes('stealth') ||
    descLower.includes('seed stage') ||
    descLower.includes('pre-seed') ||
    descLower.includes('recently founded') ||
    descLower.includes('incubated');

  if (isSeedOrNew) {
    return {
      category: 'New Companies',
      tier: 4,
      reason: 'Recently founded organisation in early-stage emergence or seed phase with innovative product mandate.'
    };
  }

  const isStartup =
    descLower.includes('series a') ||
    descLower.includes('series b') ||
    descLower.includes('series c') ||
    descLower.includes('fast-growing startup') ||
    descLower.includes('vc backed') ||
    descLower.includes('scale-up') ||
    descLower.includes('venture-backed') ||
    descLower.includes('startup environment') ||
    descLower.includes('early stage') ||
    allTags.includes('startup') ||
    allTags.includes('y combinator');

  if (isStartup) {
    return {
      category: 'Startups',
      tier: 3,
      reason: 'Venture-backed high-growth business operating in agile product iteration cycles.'
    };
  }

  // Check for public company or corporate markers
  const isCorporate =
    descLower.includes('fortune 500') ||
    descLower.includes('publicly traded') ||
    descLower.includes('nasdaq') ||
    descLower.includes('nyse') ||
    descLower.includes('global leader') ||
    descLower.includes('multinational');

  if (isCorporate) {
    return {
      category: 'Top Companies',
      tier: 1,
      reason: 'Publicly traded or enterprise market leader with extensive global reach.'
    };
  }

  // Check company size or age
  const isEstablished =
    descLower.includes('founded in 19') ||
    descLower.includes('founded in 200') ||
    descLower.includes('founded in 201') ||
    descLower.includes('over 500 employees') ||
    descLower.includes('1000+ employees') ||
    descLower.includes('enterprise customers');

  if (isEstablished) {
    return {
      category: 'Established Companies',
      tier: 2,
      reason: 'Established commercial organisation with proven market stability and institutional foundation.'
    };
  }

  // Default heuristic based on employer profile
  return {
    category: 'Established Companies',
    tier: 2,
    reason: 'Verified operating business with stable commercial hiring presence.'
  };
}
