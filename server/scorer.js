/**
 * Intelligent Job Ranking & Scoring Engine
 *
 * Weighting Formula:
 * - Skills match: 30%
 * - Professional experience match: 25%
 * - Job responsibilities match: 20%
 * - Industry relevance: 10%
 * - Experience-level suitability: 10%
 * - Company quality and reputation: 5%
 *
 * Ensures candidate suitability drives the ranking while company reputation provides a subtle boost
 * without pushing an unsuitable job above a highly relevant match.
 */

// Safe string converter to prevent any "t.toLowerCase is not a function" errors
function toStr(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.title || val.name || val.label || val.value || val.tag || Object.values(val).filter(v => typeof v === 'string').join(' ') || '';
  }
  return String(val);
}

const GENERIC_TITLE_WORDS = new Set([
  'senior', 'junior', 'lead', 'staff', 'principal', 'head', 'vp', 'director', 'manager',
  'associate', 'intern', 'specialist', 'officer', 'coordinator', 'assistant', 'clerk',
  'level', 'ii', 'iii', 'iv', 'team', 'global', 'group', 'regional', 'part', 'time', 'full'
]);

function getCoreTitleWords(title) {
  return toStr(title).toLowerCase().split(/[^a-z0-9]/).filter(w => w.length > 2 && !GENERIC_TITLE_WORDS.has(w));
}

export function scoreJob(candidateProfile = {}, job = {}) {
  const rawSkills = (candidateProfile.skills || []).concat(candidateProfile.toolsAndSoftware || []);
  const profileSkills = rawSkills.map(toStr).filter(Boolean);
  const lowerProfileSkills = profileSkills.map(s => s.toLowerCase());

  const rawTitles = candidateProfile.suitableJobTitles || [];
  const candidateTitles = (Array.isArray(rawTitles) ? rawTitles : [rawTitles]).map(toStr).filter(Boolean).map(t => t.toLowerCase());
  const currentRole = toStr(candidateProfile.currentRole).toLowerCase();
  const allCandidateRoles = [currentRole, ...candidateTitles].filter(Boolean);

  const candidateYears = Number(candidateProfile.yearsOfExperience) || 3;
  const candidateLevel = toStr(candidateProfile.experienceLevel || 'Mid-Level').toLowerCase();

  const jobTitle = toStr(job.title).toLowerCase();
  const jobDesc = toStr(job.description).toLowerCase();
  const rawTags = Array.isArray(job.tags) ? job.tags : [job.tags];
  const jobTags = rawTags.map(toStr).filter(Boolean).map(t => t.toLowerCase());
  const companyCategory = toStr(job.companyCategory) || 'Established Companies';

  // 1. SKILLS MATCH (30%)
  const matchedSkills = [];
  const candidateSkillSet = new Set(lowerProfileSkills);

  // Extract skills found in job description, title, or tags
  for (const skill of lowerProfileSkills) {
    if (jobDesc.includes(skill) || jobTags.some(t => t.includes(skill)) || jobTitle.includes(skill)) {
      const orig = profileSkills.find(s => s.toLowerCase() === skill) || skill;
      if (!matchedSkills.includes(orig)) {
        matchedSkills.push(orig);
      }
    }
  }

  // Common industry technical/design/marketing skills for missing skills analysis
  const benchmarkSkills = [
    'react', 'typescript', 'javascript', 'python', 'node', 'aws', 'docker', 'kubernetes', 'sql', 'graphql',
    'figma', 'ui/ux', 'design systems', 'user research', 'prototyping', 'wireframing', 'adobe creative cloud',
    'seo', 'sem', 'content strategy', 'analytics', 'growth marketing', 'hubspot', 'copywriting',
    'machine learning', 'pytorch', 'tensorflow', 'nlp', 'pandas', 'scikit-learn', 'bigquery',
    'agile', 'ci/cd', 'rest apis', 'microservices', 'leadership', 'communication', 'strategic planning'
  ];

  const missingSkills = [];
  for (const b of benchmarkSkills) {
    if (jobDesc.includes(b) && !candidateSkillSet.has(b)) {
      const formatted = b.charAt(0).toUpperCase() + b.slice(1);
      if (!missingSkills.includes(formatted)) {
        missingSkills.push(formatted);
      }
    }
  }

  // Dynamic skill match score: 3+ matched skills in a job is an exceptional fit
  let skillsScore = 20;
  if (matchedSkills.length >= 4) {
    skillsScore = 96;
  } else if (matchedSkills.length === 3) {
    skillsScore = 90;
  } else if (matchedSkills.length === 2) {
    skillsScore = 80;
  } else if (matchedSkills.length === 1) {
    skillsScore = 65;
  } else {
    // If 0 skills matched directly, check if title aligns strongly
    skillsScore = 25;
  }

  // 2. PROFESSIONAL EXPERIENCE & ROLE MATCH (25%)
  // Extracts core domain words (excluding generic words like "senior", "lead", "manager")
  const candidateCoreWords = new Set();
  for (const role of allCandidateRoles) {
    for (const w of getCoreTitleWords(role)) {
      candidateCoreWords.add(w);
    }
  }

  const jobCoreWords = getCoreTitleWords(jobTitle);
  let coreMatches = 0;
  for (const w of jobCoreWords) {
    if (candidateCoreWords.has(w)) {
      coreMatches++;
    }
  }

  let experienceScore = 25;
  const exactPhraseMatch = allCandidateRoles.some(r => r && (jobTitle.includes(r) || r.includes(jobTitle)));

  if (exactPhraseMatch || coreMatches >= 2) {
    experienceScore = 96;
  } else if (coreMatches === 1) {
    experienceScore = 84;
  } else if (matchedSkills.length >= 2) {
    experienceScore = 65;
  } else {
    experienceScore = 20; // Unrelated field
  }

  // 3. JOB RESPONSIBILITIES MATCH (20%)
  let responsibilitiesScore = 30;
  const rawTransferable = candidateProfile.transferableSkills || [];
  const transferable = (Array.isArray(rawTransferable) ? rawTransferable : [rawTransferable]).map(toStr).filter(Boolean).map(s => s.toLowerCase());
  let transferableHits = 0;
  for (const t of transferable) {
    if (t && jobDesc.includes(t)) transferableHits++;
  }

  const responsibilityVerbs = ['lead', 'build', 'design', 'collaborate', 'deliver', 'manage', 'architect', 'analyze', 'drive'];
  let verbHits = 0;
  for (const v of responsibilityVerbs) {
    if (jobDesc.includes(v)) verbHits++;
  }

  // Responsibilities score should reflect role relevance
  if (coreMatches >= 1 || exactPhraseMatch) {
    responsibilitiesScore = Math.min(96, Math.max(70, 70 + transferableHits * 6 + verbHits * 3));
  } else {
    responsibilitiesScore = Math.min(50, Math.max(20, 20 + transferableHits * 4 + verbHits * 2));
  }

  // 4. INDUSTRY RELEVANCE (10%)
  let industryScore = 50;
  const rawIndustries = (candidateProfile.targetIndustries || []).concat(candidateProfile.industryKnowledge || []);
  const candidateIndustries = (Array.isArray(rawIndustries) ? rawIndustries : [rawIndustries]).map(toStr).filter(Boolean).map(i => i.toLowerCase());
  const jobIndustry = toStr(job.category || job.jobIndustry || job.tags?.join(' ')).toLowerCase();

  if (candidateIndustries.some(i => i && (jobIndustry.includes(i) || jobDesc.includes(i)))) {
    industryScore = 94;
  } else if (jobIndustry.includes('tech') || jobIndustry.includes('software') || jobIndustry.includes('digital') || jobIndustry.includes('design')) {
    industryScore = 82;
  } else {
    industryScore = 50;
  }

  // 5. EXPERIENCE-LEVEL SUITABILITY (10%)
  let levelScore = 70;
  let jobRequiredLevel = 'Mid-Level';
  let jobRequiredExp = '2–5 Years';

  if (jobTitle.includes('senior') || jobTitle.includes('lead') || jobTitle.includes('principal') || jobTitle.includes('staff') || jobDesc.includes('5+ years') || jobDesc.includes('6+ years')) {
    jobRequiredLevel = 'Senior Level';
    jobRequiredExp = '5+ Years';
  } else if (jobTitle.includes('junior') || jobTitle.includes('entry') || jobTitle.includes('intern') || jobTitle.includes('associate') || jobDesc.includes('0-2 years') || jobDesc.includes('1-2 years')) {
    jobRequiredLevel = 'Entry Level';
    jobRequiredExp = '0–2 Years';
  }

  if (candidateLevel.includes('senior')) {
    if (jobRequiredLevel === 'Senior Level') levelScore = 96;
    else if (jobRequiredLevel === 'Mid-Level') levelScore = 88;
    else levelScore = 60; // overqualified
  } else if (candidateLevel.includes('entry')) {
    if (jobRequiredLevel === 'Entry Level') levelScore = 96;
    else if (jobRequiredLevel === 'Mid-Level') levelScore = 72;
    else levelScore = 45; // underqualified
  } else {
    // Mid-level candidate
    if (jobRequiredLevel === 'Mid-Level') levelScore = 95;
    else if (jobRequiredLevel === 'Senior Level') levelScore = 78;
    else levelScore = 82;
  }

  // 6. COMPANY QUALITY & REPUTATION (5%)
  let companyScore = 72;
  if (companyCategory === 'Top Companies' || job.companyTier === 1) {
    companyScore = 98;
  } else if (companyCategory === 'Established Companies' || job.companyTier === 2) {
    companyScore = 84;
  } else if (companyCategory === 'Startups' || job.companyTier === 3) {
    companyScore = 78;
  } else if (companyCategory === 'New Companies') {
    companyScore = 72;
  }

  // WEIGHTED CALCULATION
  const totalScore = Math.round(
    (skillsScore * 0.30) +
    (experienceScore * 0.25) +
    (responsibilitiesScore * 0.20) +
    (industryScore * 0.10) +
    (levelScore * 0.10) +
    (companyScore * 0.05)
  );

  // Generate clear bulleted rationale
  const whyMatches = [];
  if (exactPhraseMatch || coreMatches >= 1) {
    whyMatches.push(`Strong role alignment with candidate's capability in ${job.title}.`);
  }
  if (matchedSkills.length > 0) {
    whyMatches.push(`Direct hands-on experience in ${matchedSkills.slice(0, 4).join(', ')}.`);
  }
  if (levelScore >= 85) {
    whyMatches.push(`Experience level matches the required scope (${jobRequiredExp}).`);
  }
  if (companyCategory === 'Top Companies') {
    whyMatches.push('Top-tier global organization offering exceptional visibility and career impact.');
  } else if (companyCategory === 'Startups') {
    whyMatches.push('High-growth startup environment with high ownership and rapid development.');
  }

  if (whyMatches.length === 0) {
    whyMatches.push('Transferable capability across organizational collaboration and execution.');
  }

  return {
    totalScore: Math.min(99, Math.max(15, totalScore)),
    breakdown: {
      skills: { score: skillsScore, weight: 30, contribution: Number((skillsScore * 0.30).toFixed(1)) },
      experience: { score: experienceScore, weight: 25, contribution: Number((experienceScore * 0.25).toFixed(1)) },
      responsibilities: { score: responsibilitiesScore, weight: 20, contribution: Number((responsibilitiesScore * 0.20).toFixed(1)) },
      industry: { score: industryScore, weight: 10, contribution: Number((industryScore * 0.10).toFixed(1)) },
      levelSuitability: { score: levelScore, weight: 10, contribution: Number((levelScore * 0.10).toFixed(1)) },
      companyQuality: { score: companyScore, weight: 5, contribution: Number((companyScore * 0.05).toFixed(1)) }
    },
    whyMatches,
    matchedSkills,
    missingSkills: missingSkills.slice(0, 4),
    requiredExperience: jobRequiredExp,
    experienceLevel: jobRequiredLevel
  };
}
