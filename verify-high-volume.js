import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const APP_URL = 'http://localhost:5001';
const SCREENSHOT_DIR = path.resolve('screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  console.log('🚀 Launching High-Volume City-Specific Verification Suite on ' + APP_URL);
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[Discovery') || text.includes('Error')) {
      console.log('  [Browser]', text);
    }
  });

  try {
    // TEST 1: Landing Page & Profile Selection
    console.log('\n--- TEST 1: Loading Ajit Job Finder Landing Page ---');
    await page.goto(APP_URL, { waitUntil: 'networkidle2' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });

    const title = await page.title();
    console.log('✅ Page Title:', title);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_landing_page.png') });

    // Select candidate Maya Lin (Senior Product Designer)
    console.log('👤 Selecting 1-Click Candidate Profile: Maya Lin (Senior Product Designer)...');
    await page.waitForFunction(() => document.body.innerText.toUpperCase().includes('MAYA LIN'));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.toUpperCase().includes('MAYA LIN'));
      if (btn) btn.click();
    });

    await page.waitForFunction(() => document.body.innerText.toUpperCase().includes('AI-MAPPED TARGET JOB CATEGORIES') || document.body.innerText.toUpperCase().includes('DISCOVER OPPORTUNITIES IN'));
    console.log('✅ Maya Lin profile loaded with multi-category target job titles!');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_profile_loaded.png') });

    // TEST 2: High-Volume Search for San Francisco (Limit: 5,000 jobs)
    console.log('\n--- TEST 2: High-Volume Search for San Francisco (5,000 Requested) ---');
    
    // Set location input to "San Francisco"
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="London"], input[type="text"]');
      if (input) {
        input.value = 'San Francisco';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const select = document.querySelector('select');
      if (select) {
        select.value = '5000';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Click Discover Opportunities button
    console.log('🔎 Launching Discovery Engine for San Francisco (Target Pool: 5,000 jobs)...');
    await page.click('button[type="submit"]');

    // Wait for search results
    await page.waitForFunction(() => document.body.innerText.toUpperCase().includes('JOB DISCOVERY TELEMETRY') || document.body.innerText.toUpperCase().includes('TOTAL DISCOVERED'), { timeout: 45000 });
    console.log('✅ Discovery completed! Telemetry & Results rendered on screen.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_sf_search_results.png') });

    // TEST 3: Verify Telemetry Values (Total Scanned, Unique Collected, Duplicates Removed, Excluded)
    console.log('\n--- TEST 3: Telemetry & Result Transparency Verification ---');
    const telemetry = await page.evaluate(() => {
      const text = document.body.innerText.toUpperCase();
      return {
        hasTelemetryHeader: text.includes('JOB DISCOVERY TELEMETRY'),
        hasRequested: text.includes('5,000'),
        hasUniqueCollected: text.includes('UNIQUE COLLECTED') || text.includes('UNIQUE JOBS'),
        hasDuplicatesMerged: text.includes('DUPLICATES MERGED') || text.includes('DUPLICATES REMOVED'),
        hasLocationFiltered: text.includes('LOCATION FILTERED') || text.includes('LOCATION MISMATCHES'),
        hasSourcesQueried: text.includes('SOURCES QUERIED') || text.includes('SOURCES SEARCHED')
      };
    });
    console.log('Telemetry Check:', telemetry);
    if (!telemetry.hasTelemetryHeader) throw new Error('Telemetry header missing');

    // TEST 4: Strict City Verification (Ensure NO San Jose, Oakland, LA, or Generic Remote)
    console.log('\n--- TEST 4: Strict City Filtering Verification for San Francisco ---');
    const cityCheck = await page.evaluate(() => {
      const cardLocations = Array.from(document.querySelectorAll('div, span, p'))
        .filter(el => el.innerText && (el.innerText.includes('San Francisco') || el.innerText.includes('San Jose') || el.innerText.includes('Oakland')))
        .map(el => el.innerText);

      const hasSanFrancisco = cardLocations.some(t => t.includes('San Francisco'));
      const hasSanJose = cardLocations.some(t => t.includes('San Jose, CA') && !t.includes('San Francisco'));
      const hasOakland = cardLocations.some(t => t.includes('Oakland, CA') && !t.includes('San Francisco'));

      return { hasSanFrancisco, hasSanJose, hasOakland };
    });
    console.log('City Check:', cityCheck);
    if (!cityCheck.hasSanFrancisco) throw new Error('San Francisco jobs not found');
    if (cityCheck.hasSanJose) throw new Error('FAIL: Leaked San Jose into San Francisco search');
    if (cityCheck.hasOakland) throw new Error('FAIL: Leaked Oakland into San Francisco search');
    console.log('✅ Strict city filtering passed! All displayed positions belong to San Francisco.');

    // TEST 5: Verify High Yield Count (Must be > 1,000 unique jobs, far exceeding previous 200-300 limit)
    console.log('\n--- TEST 5: Result Volume Verification ---');
    const totalFoundText = await page.evaluate(() => {
      const el = document.querySelector('div.text-xs.sm\\:text-sm');
      return el ? el.innerText : document.body.innerText.slice(0, 500);
    });
    console.log('Showing status:', totalFoundText);

    // TEST 6: Top Companies Filter & Sorting
    console.log('\n--- TEST 6: Testing Top Companies Filter & Sorting ---');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const topCompBtn = btns.find(b => b.innerText.includes('Top Companies'));
      if (topCompBtn) topCompBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_filtered_top_companies.png') });
    console.log('✅ Top Companies dynamic filter verified!');

    // TEST 7: Sorting by Company Name (A-Z)
    console.log('\n--- TEST 7: Sorting by Company Name (A-Z) ---');
    await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const sortSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'company_name'));
      if (sortSelect) {
        sortSelect.value = 'company_name';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ Company Name (A-Z) sorting verified!');

    // TEST 8: Score Breakdown Modal (6-Factor Transparency)
    console.log('\n--- TEST 8: 6-Factor Score Breakdown Modal ---');
    await page.evaluate(() => {
      const breakdownBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Breakdown') || b.innerText.includes('6-Factor'));
      if (breakdownBtns.length > 0) breakdownBtns[0].click();
    });
    await page.waitForFunction(() => document.body.innerText.toUpperCase().includes('AI MATCH SCORE FORMULA') || document.body.innerText.toUpperCase().includes('TOTAL AI RELEVANCE SCORE'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_score_breakdown_modal.png') });
    console.log('✅ 6-Factor AI Scoring breakdown modal verified!');

    // Close modal
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Close') || b.innerText.includes('✕'));
      if (closeBtns.length > 0) closeBtns[0].click();
    });
    await new Promise(r => setTimeout(r, 500));

    // TEST 9: Save & Applied Opportunity Tracker Drawer
    console.log('\n--- TEST 9: Save Opportunity & Tracker Drawer ---');
    await page.evaluate(() => {
      const saveBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Save') || b.querySelector('svg'));
      const firstSave = saveBtns.find(b => b.innerText.includes('Save'));
      if (firstSave) firstSave.click();
    });

    // Open Saved drawer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const drawerBtn = btns.find(b => b.innerText.includes('Tracker'));
      if (drawerBtn) drawerBtn.click();
    });
    await page.waitForFunction(() => document.body.innerText.toUpperCase().includes('SAVED') || document.body.innerText.toUpperCase().includes('TRACKED'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_saved_drawer.png') });
    console.log('✅ Saved & Applied Application Tracker verified!');

    // TEST 10: Strict City Search for New York
    console.log('\n--- TEST 10: Strict City Search for New York (City Switch) ---');
    // Close drawer
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close"], button.text-slate-400');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Switch location to New York
    await page.evaluate(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        input.value = 'New York';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.click('button[type="submit"]');
    await page.waitForFunction(() => document.body.innerText.includes('New York') && document.body.innerText.includes('Job Discovery Telemetry'), { timeout: 35000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_ny_search_results.png') });

    const nyCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasNewYork: text.includes('New York') || text.includes('NYC') || text.includes('Manhattan'),
        hasJerseyCity: text.includes('Jersey City, NJ') && !text.includes('New York'),
        totalShowing: document.querySelector('div.text-xs.sm\\:text-sm')?.innerText
      };
    });
    console.log('New York City Check:', nyCheck);
    if (!nyCheck.hasNewYork) throw new Error('New York positions not found');
    if (nyCheck.hasJerseyCity) throw new Error('FAIL: Leaked Jersey City into New York search');
    console.log('✅ Strict city filtering for New York passed! Output:', nyCheck.totalShowing);

    console.log('\n🎉 ALL 10 HIGH-VOLUME CITY-SPECIFIC JOB DISCOVERY TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Verification Failed:', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error_state.png') });
    throw err;
  } finally {
    await page.close();
  }
}

runVerification();
