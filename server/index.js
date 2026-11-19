import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import dotenv from 'dotenv';
import { parseResumeWithGemini } from './gemini.js';
import { discoverJobs } from './jobAggregator.js';
import { SAMPLE_PROFILES } from './sampleProfiles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Setup multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'AI-Powered Smart Job Discovery Engine',
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

/**
 * Get ready-to-test sample candidate profiles
 */
app.get('/api/sample-profiles', (req, res) => {
  res.json({
    profiles: SAMPLE_PROFILES
  });
});

/**
 * Parse uploaded resume file (PDF, DOCX, TXT) with Gemini AI
 */
app.post('/api/profile/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const { originalname, mimetype, buffer } = req.file;
    let extractedText = '';

    console.log(`[Upload] Processing file: ${originalname} (${mimetype}, ${buffer.length} bytes)`);

    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const parsedPdf = await pdfParse(buffer);
      extractedText = parsedPdf.text || '';
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const parsedDocx = await mammoth.extractRawText({ buffer });
      extractedText = parsedDocx.value || '';
    } else if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else {
      // Fallback text decoding
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Could not extract readable text from the uploaded file.' });
    }

    console.log(`[Upload] Extracted ${extractedText.length} characters. Running Gemini Career Discovery...`);
    const profile = await parseResumeWithGemini(extractedText);

    res.json({
      success: true,
      profile,
      extractedSnippet: extractedText.slice(0, 300)
    });
  } catch (err) {
    console.error('[Upload] Error processing resume:', err);
    res.status(500).json({ error: err.message || 'Failed to process resume' });
  }
});

/**
 * Parse pasted plain text or edited knowledge base with Gemini AI
 */
app.post('/api/profile/parse-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'No profile text provided.' });
    }

    console.log(`[ParseText] Analyzing candidate knowledge base text (${text.length} chars)...`);
    const profile = await parseResumeWithGemini(text);

    res.json({
      success: true,
      profile
    });
  } catch (err) {
    console.error('[ParseText] Error parsing text:', err);
    res.status(500).json({ error: err.message || 'Failed to parse profile text' });
  }
});

/**
 * Search and discover jobs (Standard JSON endpoint)
 * Inputs:
 * - profile: Candidate knowledge base object (with AI-discovered titles and skills)
 * - location: City, State, Country, or multiple (e.g. London, California, Singapore, Toronto, Germany)
 * - limit: 50, 100, 500, 1000, 5000 (Default: 1000)
 * - allowRemote: boolean (Default: false for city searches)
 */
app.post('/api/jobs/search', async (req, res) => {
  try {
    const { profile, location, limit = 1000, allowRemote = false } = req.body;

    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Location is required. E.g. London, San Francisco, New York, Toronto.' });
    }

    if (!profile) {
      return res.status(400).json({ error: 'Candidate profile or knowledge base is required. Please upload or select a profile first.' });
    }

    console.log(`[Search] Searching jobs for location "${location}", limit ${limit}, allowRemote ${allowRemote}, profile role "${profile.currentRole || 'Candidate'}"`);
    const result = await discoverJobs({ profile, location, limit, allowRemote });

    res.json({
      success: true,
      meta: result.meta,
      jobs: result.jobs
    });
  } catch (err) {
    console.error('[Search] Error discovering jobs:', err);
    res.status(500).json({ error: err.message || 'Job discovery engine error' });
  }
});

/**
 * Progressive Streaming Search (Server-Sent Events)
 * Streams real-time discovery telemetry & batches as vacancies are gathered.
 */
app.post('/api/jobs/search-stream', async (req, res) => {
  try {
    const { profile, location, limit = 1000, allowRemote = false } = req.body;

    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Location is required.' });
    }
    if (!profile) {
      return res.status(400).json({ error: 'Candidate profile required.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent('progress', {
      status: 'initiating',
      message: `Analyzing profile and expanding multi-angle queries for ${location}...`,
      sourcesSearched: 12
    });

    const result = await discoverJobs({
      profile,
      location,
      limit,
      allowRemote,
      onProgress: (prog) => {
        sendEvent('progress', {
          status: 'scanning',
          totalDiscovered: prog.totalDiscovered,
          sourcesSearched: prog.sourcesSearched
        });
      }
    });

    sendEvent('complete', {
      meta: result.meta,
      jobs: result.jobs
    });

    res.end();
  } catch (err) {
    console.error('[SearchStream] Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve client dist in production if available
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.listen(PORT, () => {
  console.log(`\n✅ AI Smart Job Finder Server running at http://localhost:${PORT}`);
  console.log(`📡 Ready to discover jobs with Gemini AI and Live Aggregators.\n`);
});

// Fallback to client index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});
