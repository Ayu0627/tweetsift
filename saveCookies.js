const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // headful so you can see and pass login
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  await page.goto('https://twitter.com/login', { waitUntil: 'networkidle2' });

  console.log('🟡 Logging into Twitter...');

  // Enter username/email
  await page.waitForSelector('input[name="text"]', { timeout: 10000 });
  await page.type('input[name="text"]', process.env.X_USERNAME, { delay: 50 });
  await page.keyboard.press('Enter');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Enter password
  await page.waitForSelector('input[name="password"]', { timeout: 10000 });
  await page.type('input[name="password"]', process.env.X_PASSWORD, { delay: 50 });
  await page.keyboard.press('Enter');

  // Wait for login to complete
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('✅ Logged in. Saving cookies...');

  // Save cookies
  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

  console.log('✅ Cookies saved to cookies.json');
  await browser.close();
})();
