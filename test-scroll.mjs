import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', msg => {
  if (msg.type() === 'error' || msg.text().includes('Failed') || msg.text().includes('Error')) {
    console.log(`[${msg.type()}] ${msg.text()}`);
  }
});

console.log('Navigating to /family...');
await page.goto('http://localhost:3002/family', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

// Scroll to trigger animation phases
console.log('Scrolling to 50%...');
await page.evaluate(() => document.querySelector('.overflow-y-scroll')?.scrollTo(0, document.querySelector('.overflow-y-scroll')?.scrollHeight * 0.5));
await page.waitForTimeout(1000);

console.log('Scrolling to 90%...');
await page.evaluate(() => document.querySelector('.overflow-y-scroll')?.scrollTo(0, document.querySelector('.overflow-y-scroll')?.scrollHeight * 0.9));
await page.waitForTimeout(1000);

console.log('Done scrolling.');
await browser.close();
