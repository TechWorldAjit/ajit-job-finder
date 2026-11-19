/**
 * Strict City Matcher & Location Verifier
 * 
 * Enforces rigorous city-based boundary filtering:
 * 1. Requires physical presence in the exact specified city.
 * 2. Excludes neighboring metropolitan cities (e.g. excludes San Jose, Oakland, Palo Alto when San Francisco is searched).
 * 3. Excludes broad state/country listings (e.g. excludes "California", "United States", "USA", "Remote US") unless the city is explicitly named.
 * 4. Excludes remote jobs by default for city-specific searches, unless the user specifically searched for Remote or enabled the Remote filter.
 * 5. Supports multi-office listings (e.g. "Seattle, WA; San Francisco, CA; New York, NY") if and only if the target city is explicitly listed.
 */

function toSafeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.name || val.location || val.title || JSON.stringify(val);
  return String(val);
}

// Known neighboring cities to explicitly reject when a city is specified
const EXCLUSION_ZONES = {
  'san francisco': ['san jose', 'oakland', 'palo alto', 'mountain view', 'sunnyvale', 'santa clara', 'fremont', 'berkeley', 'redwood city', 'san mateo', 'cupertino', 'menlo park', 'los angeles', 'san diego', 'irvine', 'sacramento'],
  'new york': ['jersey city', 'hoboken', 'newark', 'stamford', 'white plains', 'yonkers', 'philadelphia', 'boston'],
  'london': ['manchester', 'birmingham', 'leeds', 'glasgow', 'edinburgh', 'bristol', 'cambridge', 'oxford', 'reading', 'slough', 'croydon', 'london, on', 'london, ontario'],
  'toronto': ['mississauga', 'brampton', 'vaughan', 'markham', 'oakville', 'hamilton', 'waterloo', 'kitchener', 'ottawa', 'montreal', 'vancouver'],
  'berlin': ['munich', 'frankfurt', 'hamburg', 'cologne', 'stuttgart', 'dusseldorf', 'leipzig'],
  'singapore': ['malaysia', 'indonesia', 'jakarta', 'kuala lumpur', 'bangkok']
};

/**
 * Evaluates whether a job's verified location satisfies strict city criteria.
 * 
 * @param {string} jobLocation - The raw location string from the job feed.
 * @param {string} queryLocation - The user's requested location.
 * @param {boolean} allowRemote - Whether remote positions are permitted (e.g. remote filter active or query was Remote).
 * @returns {{ matched: boolean, isStrictCity: boolean, reason: string }}
 */
export function evaluateCityLocation(jobLocation, queryLocation, allowRemote = false) {
  const loc = toSafeString(jobLocation).toLowerCase().trim();
  const query = toSafeString(queryLocation).toLowerCase().trim();

  // 1. If query is Remote / Worldwide / Anywhere
  if (!query || query === 'any' || query === 'worldwide' || query === 'global' || query.includes('remote') || query.includes('anywhere')) {
    const isRemoteJob = loc.includes('remote') || loc.includes('anywhere') || loc.includes('worldwide') || loc.includes('global') || loc.includes('work from home');
    return {
      matched: true,
      isStrictCity: false,
      reason: isRemoteJob ? 'Remote / Worldwide Match' : 'Global Master Pool'
    };
  }

  // Determine the core target city
  const queryCityTokens = query.split(',')[0].trim().toLowerCase();

  // 2. Check if the job is explicitly marked as pure Remote without city presence
  const isPureRemote = (
    loc === 'remote' ||
    loc === 'remote, us' ||
    loc === 'united states - remote' ||
    loc === 'us remote' ||
    loc === 'remote - usa' ||
    loc === 'remote (us)' ||
    loc === 'remote, usa' ||
    loc === 'remote - uk' ||
    loc === 'uk remote' ||
    loc === 'remote / worldwide' ||
    loc === 'remote, canada' ||
    loc === 'canada remote' ||
    loc === 'anywhere' ||
    loc === 'worldwide'
  );

  if (isPureRemote) {
    if (allowRemote) {
      return { matched: true, isStrictCity: false, reason: 'Allowed via Remote Filter' };
    }
    return { matched: false, isStrictCity: false, reason: 'Excluded: Generic Remote without verified physical city address' };
  }

  // 3. Multi-location office handling (e.g. "Seattle, WA; San Francisco, CA; New York, NY")
  const officeLocations = loc.split(/;|\/|\||\bor\b/g).map(s => s.trim()).filter(Boolean);

  // 4. Strict City Rules for Major Hubs
  if (queryCityTokens.includes('san francisco') || queryCityTokens === 'sf') {
    // Must contain 'san francisco' or explicit 'sf, ca' / 'sf bay area'
    const hasSanFrancisco = officeLocations.some(office => 
      office.includes('san francisco') ||
      (/\bsf\b/.test(office) && (office.includes('ca') || office.includes('california')))
    );

    if (hasSanFrancisco) {
      return { matched: true, isStrictCity: true, reason: 'Verified San Francisco Workplace' };
    }

    // Check if it's one of the neighboring excluded cities
    const neighborMatches = EXCLUSION_ZONES['san francisco'].filter(neg => loc.includes(neg));
    if (neighborMatches.length > 0) {
      return { matched: false, isStrictCity: false, reason: `Excluded: Located in neighboring city (${neighborMatches.join(', ')}), not San Francisco` };
    }

    // Check if it's broad California or USA without San Francisco
    if (loc.includes('california') || loc === 'ca' || loc === 'ca, usa' || loc.includes('united states') || loc.includes('usa')) {
      return { matched: false, isStrictCity: false, reason: 'Excluded: General state/country listing without verified San Francisco location' };
    }

    return { matched: false, isStrictCity: false, reason: 'Excluded: City mismatch' };
  }

  if (queryCityTokens.includes('new york') || queryCityTokens === 'nyc') {
    const hasNewYork = officeLocations.some(office => 
      office.includes('new york') ||
      office.includes('nyc') ||
      office.includes('manhattan') ||
      office.includes('brooklyn') ||
      office.includes('queens')
    );

    if (hasNewYork) {
      return { matched: true, isStrictCity: true, reason: 'Verified New York City Workplace' };
    }

    const neighborMatches = EXCLUSION_ZONES['new york'].filter(neg => loc.includes(neg));
    if (neighborMatches.length > 0) {
      return { matched: false, isStrictCity: false, reason: `Excluded: Located in neighboring area (${neighborMatches.join(', ')}), not NYC` };
    }

    return { matched: false, isStrictCity: false, reason: 'Excluded: City mismatch' };
  }

  if (queryCityTokens.includes('london')) {
    // Exclude London, Ontario Canada
    if (loc.includes('london, on') || loc.includes('london, ontario')) {
      return { matched: false, isStrictCity: false, reason: 'Excluded: London Ontario (Canada)' };
    }

    const hasLondon = officeLocations.some(office => 
      office.includes('london') ||
      office.includes('greater london') ||
      office.includes('city of london')
    );

    if (hasLondon) {
      return { matched: true, isStrictCity: true, reason: 'Verified London Workplace' };
    }

    const neighborMatches = EXCLUSION_ZONES['london'].filter(neg => loc.includes(neg));
    if (neighborMatches.length > 0) {
      return { matched: false, isStrictCity: false, reason: `Excluded: Located in UK city (${neighborMatches.join(', ')}), not London` };
    }

    return { matched: false, isStrictCity: false, reason: 'Excluded: City mismatch' };
  }

  if (queryCityTokens.includes('toronto')) {
    const hasToronto = officeLocations.some(office => 
      office.includes('toronto') ||
      office.includes('greater toronto') ||
      office.includes('downtown toronto')
    );

    if (hasToronto) {
      return { matched: true, isStrictCity: true, reason: 'Verified Toronto Workplace' };
    }

    const neighborMatches = EXCLUSION_ZONES['toronto'].filter(neg => loc.includes(neg));
    if (neighborMatches.length > 0) {
      return { matched: false, isStrictCity: false, reason: `Excluded: Located in GTA/Ontario city (${neighborMatches.join(', ')}), not Toronto` };
    }

    return { matched: false, isStrictCity: false, reason: 'Excluded: City mismatch' };
  }

  // 5. Generic Strict City Matcher for any other city worldwide
  const targetCityWord = queryCityTokens.replace(/[^a-z0-9\s]/g, ' ').trim();
  const wordRegex = new RegExp(`\\b${targetCityWord}\\b`, 'i');

  const hasCityWord = officeLocations.some(office => wordRegex.test(office));
  if (hasCityWord) {
    return { matched: true, isStrictCity: true, reason: `Verified ${queryCityTokens} Workplace` };
  }

  return { matched: false, isStrictCity: false, reason: `Excluded: Location does not match ${queryCityTokens}` };
}
