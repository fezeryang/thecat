import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const logs = [];
page.on('console', msg => {
  logs.push({ type: msg.type(), text: msg.text() });
});

try {
  console.log('Loading /family page...');
  await page.goto('http://localhost:3000/family', { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  await page.waitForTimeout(5000);
  
  const canvas = await page.$('canvas');
  const box = canvas ? await canvas.boundingBox() : null;
  
  console.log('\n=== Page Status ===');
  console.log('Canvas exists:', !!canvas);
  console.log('Canvas box:', box);
  
  console.log('\n=== P5 Logs ===');
  logs.forEach(log => {
    if (log.type === 'log' && (log.text.includes('P5') || log.text.includes('cat') || log.text.includes('placeholder') || log.text.includes('images'))) {
      console.log(log.text);
    }
  });
  
  console.log('\n=== Errors ===');
  logs.forEach(log => {
    if (log.type === 'error') {
      console.log(log.text);
    }
  });
  
  if (canvas) {
    await page.screenshot({ path: '/tmp/cats-family.png' });
    console.log('Screenshot saved to /tmp/cats-family.png');
  }
  
} catch (e) {
  console.log('Error:', e.message);
} finally {
  await browser.close();
}
