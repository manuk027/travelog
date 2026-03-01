const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  await page.type('input[type="email"]', 'admin@test.com');
  await page.type('input[type="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/manukrishna/.gemini/antigravity/brain/e23d03f6-0b27-4a87-9576-e8520157354b/profile_redesign_final.jpg' });
  await browser.close();
})();
