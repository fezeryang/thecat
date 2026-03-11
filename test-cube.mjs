import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Collect console messages
const consoleLogs = [];
page.on('console', msg => {
  consoleLogs.push({ type: msg.type(), text: msg.text() });
});

page.on('pageerror', err => {
  console.log('Page error:', err.message);
});

try {
  // Navigate to family page with domcontentloaded
  console.log('Navigating to /family...');
  await page.goto('http://localhost:3002/family', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('Page loaded');

  // Wait for p5 to initialize
  await page.waitForTimeout(5000);

  // Check for canvas element
  const canvas = await page.$('canvas');
  console.log('Canvas element found:', !!canvas);
  
  // Get canvas dimensions if found
  if (canvas) {
    const box = await canvas.boundingBox();
    console.log('Canvas dimensions:', box);
  }

  // Print all console logs
  console.log('\n--- All Console Logs ---');
  consoleLogs.forEach(log => {
    console.log(`[${log.type}] ${log.text}`);
  });

} catch (e) {
  console.log('Error:', e.message);
}

await browser.close();
console.log('\nTest complete.');
