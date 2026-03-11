import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Collect all console messages
const logs = [];
page.on('console', msg => {
  logs.push({ type: msg.type(), text: msg.text() });
});

// Collect page errors
const errors = [];
page.on('pageerror', err => {
  errors.push(err.message);
});

try {
  console.log('Loading /family page...');
  await page.goto('http://localhost:3000/family', { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  // Wait for p5 to initialize
  await page.waitForTimeout(5000);
  
  // Check canvas
  const canvas = await page.$('canvas');
  const canvasExists = !!canvas;
  
  // Get canvas bounding box
  let box = null;
  if (canvas) {
    box = await canvas.boundingBox();
  }
  
  console.log('\n=== Page Status ===');
  console.log('Canvas exists:', canvasExists);
  console.log('Canvas bounding box:', box);
  
  // Check for errors
  console.log('\n=== Page Errors ===');
  if (errors.length > 0) {
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('No page errors');
  }
  
  // Check relevant console logs
  console.log('\n=== Relevant Console Logs ===');
  logs.forEach(log => {
    if (log.type === 'error' || log.text.includes('p5') || log.text.includes('canvas') || 
        log.text.includes('image') || log.text.includes('Image')) {
      console.log(`[${log.type}] ${log.text}`);
    }
  });
  
  // Take screenshot
  if (canvasExists) {
    await page.screenshot({ path: '/tmp/family-page.png', fullPage: true });
    console.log('\nScreenshot saved to /tmp/family-page.png');
  }
  
} catch (e) {
  console.log('Error during test:', e.message);
} finally {
  await browser.close();
}
