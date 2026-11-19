import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const PREFERRED_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.8-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash'
];

/**
 * Call Gemini API with automatic model fallback
 */
export async function callGemini(prompt, responseMimeType = 'application/json', temperature = 0.2) {
  let lastError = null;

  for (const model of PREFERRED_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature,
          ...(responseMimeType ? { responseMimeType } : {})
        }
      };

      const res = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000
      });

      const candidate = res.data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message;
      // If 503 or 404, try next model
      lastError = err;
      console.warn(`[Gemini] Model ${model} returned error: ${errMsg}. Trying fallback...`);
    }
  }

  throw lastError || new Error('All Gemini models failed to respond');
}

/**
 * Clean and parse JSON from Gemini text response
 */
function safeJsonParse(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

/**
 * Parse candidate resume / knowledge base into structured profile
 * Automatically discovers suitable job titles without requiring user input!
 */
export async function parseResumeWithGemini(resumeText) {
  const prompt = `
You are an expert AI Career Discovery Analyst. Analyze this candidate's resume/professional knowledge base in depth.
CRITICAL: The candidate does NOT provide a job title. You MUST independently infer suitable job titles across their primary discipline and adjacent transferable fields.
For example:
- A candidate with Photoshop and Illustrator matches graphic design, visual design, branding, packaging design, marketing design.
- A candidate with Premiere Pro & After Effects matches video editing, motion graphics, advertising, multimedia design.
- A full-stack engineer matches full stack developer, frontend architect, backend engineer, cloud solutions engineer.

Analyze the profile and return a JSON object with this exact structure:
{
  "fullName": "Candidate full name or Professional Candidate",
  "currentRole": "Primary inferred professional title",
  "yearsOfExperience": number or estimated number,
  "experienceLevel": "Entry Level" | "Mid-Level" | "Senior Level",
  "summary": "3-4 sentence comprehensive career summary highlighting strengths and capabilities",
  "roles": [
    {
      "title": "Role title",
      "company": "Company or Organisation",
      "duration": "Duration or years",
      "highlights": ["Key achievements and responsibilities"]
    }
  ],
  "skills": ["Array of 8-15 core professional and technical skills"],
  "toolsAndSoftware": ["Array of software, frameworks, and tools used"],
  "industryKnowledge": ["Array of domains, industries, and specialisations"],
  "transferableSkills": ["Array of transferable capabilities, leadership, problem solving, communication"],
  "education": [
    {
      "degree": "Degree name",
      "institution": "University / School",
      "year": "Graduation year or dates"
    }
  ],
  "certifications": ["Array of certifications or credentials"],
  "suitableJobTitles": [
    "Array of 6 to 10 highly relevant and realistic job titles spanning their primary and adjacent transferable domains"
  ],
  "targetIndustries": ["Array of 4-6 industries worth targeting for this candidate"]
}

Resume Text:
"""
${resumeText.slice(0, 12000)}
"""
`;

  try {
    const rawResponse = await callGemini(prompt, 'application/json', 0.2);
    const parsed = safeJsonParse(rawResponse);
    return parsed;
  } catch (err) {
    console.error('[Gemini] Error parsing resume with AI, falling back to rule-based parser:', err.message);
    return fallbackParseResume(resumeText);
  }
}

/**
 * Fallback parser if Gemini API is temporarily unavailable
 */
export function fallbackParseResume(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || 'Professional Candidate';

  // Basic keyword extraction
  const lower = text.toLowerCase();
  const techKeywords = ['react', 'node', 'javascript', 'typescript', 'python', 'aws', 'docker', 'sql', 'figma', 'ui/ux', 'design system', 'photoshop', 'illustrator', 'seo', 'marketing', 'data analysis', 'pytorch', 'machine learning'];
  const foundSkills = techKeywords.filter(k => lower.includes(k)).map(s => s.toUpperCase());

  let expLevel = 'Mid-Level';
  let years = 3;
  if (lower.includes('senior') || lower.includes('lead') || lower.includes('architect') || lower.includes('principal') || lower.includes('6+') || lower.includes('7+') || lower.includes('8+')) {
    expLevel = 'Senior Level';
    years = 6;
  } else if (lower.includes('junior') || lower.includes('intern') || lower.includes('entry') || lower.includes('graduate')) {
    expLevel = 'Entry Level';
    years = 1;
  }

  // Derive titles
  const titles = [];
  if (lower.includes('design') || lower.includes('figma') || lower.includes('ui') || lower.includes('ux')) {
    titles.push('Product Designer', 'UI/UX Designer', 'Visual Designer', 'Design Systems Specialist', 'Brand & Graphic Designer');
  } else if (lower.includes('data') || lower.includes('machine learning') || lower.includes('python')) {
    titles.push('Data Scientist', 'Machine Learning Engineer', 'Data Analyst', 'AI Specialist', 'Business Intelligence Engineer');
  } else if (lower.includes('marketing') || lower.includes('seo') || lower.includes('growth')) {
    titles.push('Growth Marketing Manager', 'Performance Marketing Specialist', 'Digital Strategist', 'SEO & Content Lead');
  } else {
    titles.push('Full Stack Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Cloud Application Developer', 'Software Developer');
  }

  return {
    fullName: firstLine.length < 35 ? firstLine : 'Professional Candidate',
    currentRole: titles[0],
    yearsOfExperience: years,
    experienceLevel: expLevel,
    summary: 'Experienced professional with proven domain expertise, collaborative problem-solving skills, and deep capability across primary and transferable disciplines.',
    roles: [
      {
        title: titles[0],
        company: 'Previous Organisation',
        duration: `${years} years`,
        highlights: ['Delivered core projects and contributed to key technical/design initiatives.']
      }
    ],
    skills: foundSkills.length > 0 ? foundSkills : ['Problem Solving', 'Strategic Planning', 'Project Delivery', 'Cross-Functional Collaboration'],
    toolsAndSoftware: ['Modern Workflow Tools', 'Collaboration Platforms'],
    industryKnowledge: ['Technology', 'Digital Platforms'],
    transferableSkills: ['Analytical Thinking', 'Team Leadership', 'Stakeholder Communication'],
    education: [{ degree: 'Bachelor of Science / Arts', institution: 'Accredited University', year: 'Verified' }],
    certifications: [],
    suitableJobTitles: titles,
    targetIndustries: ['Technology & Software', 'Digital Media', 'FinTech', 'Modern SaaS']
  };
}
