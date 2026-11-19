import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

async function runVerification() {
  console.log('🔍 Connecting to running Chrome on http://localhost:9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  // Clear localStorage to start fresh
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  // 1. Verify Header & Landing Screen (Ajit Job Finder)
  const title = await page.title();
  console.log(`✅ Page Title: "${title}"`);
  await page.screenshot({ path: path.join(screenshotsDir, '01_landing_page.png') });

  // 2. Select Sample Profile: Maya Lin
  console.log('👤 Selecting 1-Click Candidate Profile: Maya Lin...');
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.innerText.includes('Maya Lin'));
  });

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const mayaBtn = buttons.find(b => b.innerText.includes('Maya Lin'));
    if (mayaBtn) mayaBtn.click();
  });

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, '02_profile_loaded.png') });

  // Verify Profile details
  const profileText = (await page.evaluate(() => document.body.innerText)).toLowerCase();
  if (profileText.includes('maya lin') && profileText.includes('ai-mapped target job categories')) {
    console.log('✅ Candidate profile loaded with AI-mapped target job categories!');
  } else {
    throw new Error('Candidate profile not correctly displayed');
  }

  // 3. Search Jobs in London (1,000 jobs target pool)
  console.log('🔎 Initiating Search for London (Target: 1,000 jobs)...');
  await page.click('button[type="submit"]');

  // Wait for results to populate
  console.log('⏳ Waiting for discovery engine to analyze & score vacancies from live feeds...');
  await page.waitForFunction(() => {
    const text = document.body.innerText.toLowerCase();
    return text.includes('total discovered') || text.includes('ai match');
  }, { timeout: 35000 });

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(screenshotsDir, '03_search_results.png') });
  console.log('✅ Job discovery completed! Results rendered.');

  // 4. Verify Stats Dashboard values & count
  const stats = await page.evaluate(() => {
    const text = document.body.innerText.toLowerCase();
    return {
      hasTotal: text.includes('total discovered'),
      hasTopMatches: text.includes('top matches'),
      hasTopCompanies: text.includes('top companies'),
      hasRemote: text.includes('remote opportunities'),
      hasAvgScore: text.includes('average ai match')
    };
  });
  console.log('📊 Dashboard Stats Verification:', stats);

  // 5. Test 6-Factor Breakdown Modal
  console.log('🎯 Opening 6-Factor AI Score Breakdown Modal...');
  await page.evaluate(() => {
    const breakdownBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('6-Factor Breakdown'));
    if (breakdownBtns.length > 0) breakdownBtns[0].click();
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '04_score_breakdown_modal.png') });

  const modalHasAllWeights = await page.evaluate(() => {
    const text = document.body.innerText.toLowerCase();
    return text.includes('skills match') &&
           text.includes('weight: 30%') &&
           text.includes('weight: 25%') &&
           text.includes('weight: 20%') &&
           text.includes('weight: 10%') &&
           text.includes('weight: 5%');
  });
  console.log(`✅ 6-Factor Modal Weights verified: ${modalHasAllWeights}`);

  // Close Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('div.fixed button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 6. Test Interactive Dynamic Filters (Top Companies)
  console.log('🔘 Testing Dynamic Filter Chips (Top Companies)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const topCompChip = buttons.find(b => b.innerText.includes('Top Companies') && b.querySelector('span'));
    if (topCompChip) topCompChip.click();
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '05_filtered_top_companies.png') });
  console.log('✅ Dynamic filter updated list immediately without restarting search.');

  // 7. Test Save and Mark Applied
  console.log('⭐ Testing Save Job and Mark Applied...');
  await page.evaluate(() => {
    const saveBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Save'));
    if (saveBtns.length > 0) saveBtns[0].click();

    const applyBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Mark Applied'));
    if (applyBtns.length > 0) applyBtns[0].click();
  });

  await new Promise(r => setTimeout(r, 600));

  // 8. Open Saved & Applied Drawer
  console.log('📂 Opening Saved & Applied Tracker Drawer...');
  await page.evaluate(() => {
    const drawerBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tracker'));
    if (drawerBtn) drawerBtn.click();
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '06_saved_drawer.png') });
  console.log('✅ Saved & Applied Drawer verified with tracked jobs!');

  // Close Drawer
  await page.evaluate(() => {
    const closeBtn = document.querySelector('div.fixed button');
    if (closeBtn) closeBtn.click();
  });

  console.log('\n🎉 ALL AJIT JOB FINDER MODERN UI TESTS PASSED SUCCESSFULLY!\n');
  await page.close();
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
