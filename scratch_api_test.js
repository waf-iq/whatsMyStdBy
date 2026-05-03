const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('api') || request.url().includes('Flight') || request.method() === 'POST') {
      requests.push({ url: request.url(), method: request.method() });
    }
  });

  page.on('response', async response => {
    if (response.request().method() === 'POST' || response.url().includes('api')) {
      console.log('--- FOUND POTENTIAL API RESPONSE ---');
      console.log('URL:', response.url());
      try {
        const json = await response.json();
        console.log('JSON:', JSON.stringify(json).substring(0, 300));
      } catch (e) {
        console.log('Not JSON');
      }
    }
  });

  console.log("Navigating...");
  await page.goto('https://www.airarabia.com/en/manage/flight-status/check-flight-status');
  console.log("Navigated");
  
  await page.waitForTimeout(2000);
  
  try {
    const fromInput = await page.$('input[placeholder="Origin"]');
    if(fromInput) {
      await fromInput.type('SHJ');
      await page.keyboard.press('Enter');
    } else {
      console.log("Could not find Origin input");
    }
  } catch(e) {
    console.log(e);
  }

  await page.waitForTimeout(2000);
  
  console.log("Logged Requests:");
  requests.forEach(r => console.log(r.method, r.url));

  await browser.close();
})();
