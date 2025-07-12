// const express = require('express');
// const puppeteer = require('puppeteer');
// const router = express.Router();

// // @route   POST /api/scrape
// // @desc    Scrapes X for a given keyword
// // @access  Private (should be protected in a real app)
// router.post('/', async (req, res) => {
//     const { keyword } = req.body;

//     if (!keyword) {
//         return res.status(400).json({ msg: 'Keyword is required' });
//     }

//     // --- Start of Puppeteer Logic ---
//     let browser;
//     try {
//         console.log('Launching browser...');
//         browser = await puppeteer.launch({
//             headless: false, // Set to true for production, false for development to see the browser
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//         });
//         const page = await browser.newPage();
//         await page.setViewport({ width: 1280, height: 800 });

//         // 1. LOGIN TO X
//         console.log('Navigating to X login page...');
//         await page.goto('https://x.com/login', { waitUntil: 'networkidle2' });

//         // Enter username
//         console.log('Entering username...');
//         await page.waitForSelector('input[name="text"]');
//         await page.type('input[name="text"]', process.env.X_USERNAME, { delay: 50 });
//         await page.keyboard.press('Enter');

//         // Enter password
//         console.log('Entering password...');
//         await page.waitForSelector('input[name="password"]');
//         await page.type('input[name="password"]', process.env.X_PASSWORD, { delay: 50 });
//         await page.keyboard.press('Enter');

//         // Wait for login to complete by waiting for the home timeline to appear
//         await page.waitForNavigation({ waitUntil: 'networkidle2' });
//         await page.waitForSelector('a[data-testid="AppTabBar_Home_Link"]');
//         console.log('Login successful!');

//         // 2. SEARCH FOR THE KEYWORD
//         const searchUrl = `https://x.com/search?q=${encodeURIComponent(keyword)}&src=typed_query&f=live`;
//         console.log(`Navigating to search results for: ${keyword}`);
//         await page.goto(searchUrl, { waitUntil: 'networkidle2' });
        
//         // Wait for search results to load
//         await page.waitForSelector('article[data-testid="tweet"]');
//         console.log('Search results loaded.');

//         // 3. SCRAPE THE DATA
//         console.log('Scraping posts...');
//         // Using page.evaluate to run script in the context of the page
//         const tweets = await page.evaluate(() => {
//             const twentyFourHoursAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
//             const tweetData = [];
//             const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');

//             tweetElements.forEach(tweet => {
//                 const usernameElement = tweet.querySelector('div[data-testid="User-Name"] a');
//                 const timeElement = tweet.querySelector('time');

//                 if (usernameElement && timeElement && timeElement.dateTime) {
//                     const postTime = new Date(timeElement.dateTime).getTime();
//                     // Filter for posts in the last 24 hours
//                     if (postTime >= twentyFourHoursAgo) {
//                         const username = usernameElement.innerText.trim();
//                         tweetData.push({ username });
//                     }
//                 }
//             });
//             return tweetData;
//         });

//         console.log(`Found ${tweets.length} posts from the last 24 hours.`);
        
//         // Process the results
//         const uniqueUsernames = [...new Set(tweets.map(t => t.username))];

//         res.json({
//             postCount: tweets.length,
//             usernames: uniqueUsernames
//         });

//     } catch (error) {
//         console.error('Scraping failed:', error);
//         res.status(500).json({ msg: 'An error occurred during scraping.', error: error.message });
//     } finally {
//         if (browser) {
//             console.log('Closing browser...');
//             await browser.close();
//         }
//     }
// });

// module.exports = router;
// const express = require('express');
// const puppeteer = require('puppeteer');
// const router = express.Router();

// router.post('/', async (req, res) => {
//     const { keyword } = req.body;

//     if (!keyword) {
//         return res.status(400).json({ msg: 'Keyword is required' });
//     }

//     let browser;
//     try {
//         console.log('🟡 Launching browser...');
//         browser = await puppeteer.launch({
//             headless: false,
//             args: ['--no-sandbox', '--disable-setuid-sandbox'],
//             defaultViewport: null,
//         });

//         const page = await browser.newPage();
//         await page.setViewport({ width: 1280, height: 800 });

//         const cookies = require('../cookies.json');
// await page.setCookie(...cookies);
// await page.goto('https://twitter.com/home', { waitUntil: 'networkidle2' });


//         // 1. Login to X
//         console.log('🟡 Navigating to login...');
//         await page.goto('https://twitter.com/login', { waitUntil: 'networkidle2' });

//         console.log('🟡 Typing username...');
//         await page.waitForSelector('input[name="text"]', { timeout: 8000 });
//         await page.type('input[name="text"]', process.env.X_USERNAME, { delay: 50 });
//         await page.keyboard.press('Enter');
//         await page.waitForTimeout(2000);

//         console.log('🟡 Typing password...');
//         await page.waitForSelector('input[name="password"]', { timeout: 8000 });
//         await page.type('input[name="password"]', process.env.X_PASSWORD, { delay: 50 });
//         await page.keyboard.press('Enter');

//         console.log('🟡 Waiting for home feed...');
//         await page.waitForNavigation({ waitUntil: 'networkidle2' });
//         await page.waitForSelector('a[data-testid="AppTabBar_Home_Link"]', { timeout: 10000 });
//         console.log('✅ Logged in successfully');

//         // 2. Search for keyword
//         const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(keyword)}&src=typed_query&f=live`;
//         console.log(`🟡 Navigating to search: ${searchUrl}`);
//         await page.goto(searchUrl, { waitUntil: 'networkidle2' });
//         await page.waitForTimeout(5000);

//         // Scroll to load more tweets
//         console.log('🟡 Scrolling to load more tweets...');
//         await autoScroll(page);

//         // 3. Scrape data
//         console.log('🟡 Scraping tweets...');
//         const tweets = await page.evaluate(() => {
//             const tweetData = [];
//             const tweetElements = document.querySelectorAll('article');

//             const twentyFourHoursAgo = new Date().getTime() - (24 * 60 * 60 * 1000);

//             tweetElements.forEach(tweet => {
//                 const usernameSpan = tweet.querySelector('div[dir="ltr"] span');
//                 const timeElement = tweet.querySelector('time');

//                 if (usernameSpan && timeElement && timeElement.dateTime) {
//                     const postTime = new Date(timeElement.dateTime).getTime();
//                     if (postTime >= twentyFourHoursAgo) {
//                         tweetData.push({
//                             username: usernameSpan.innerText.trim(),
//                             time: timeElement.dateTime,
//                         });
//                     }
//                 }
//             });

//             return tweetData;
//         });

//         console.log(`✅ Found ${tweets.length} tweets`);
//         const uniqueUsernames = [...new Set(tweets.map(t => t.username))];

//         res.json({
//             postCount: tweets.length,
//             usernames: uniqueUsernames,
//         });

//     } catch (error) {
//         console.error('❌ Scraping failed:', error.message);
//         res.status(500).json({
//             msg: 'An error occurred during scraping.',
//             error: error.message,
//         });
//     } finally {
//         if (browser) {
//             console.log('🟡 Closing browser...');
//             await browser.close();
//         }
//     }
// });

// // Helper to scroll the page
// async function autoScroll(page) {
//     await page.evaluate(async () => {
//         await new Promise(resolve => {
//             let totalHeight = 0;
//             const distance = 500;
//             const timer = setInterval(() => {
//                 const scrollHeight = document.body.scrollHeight;
//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 if (totalHeight >= scrollHeight || totalHeight > 3000) {
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 400);
//         });
//     });
// }

// module.exports = router;
const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ msg: 'Keyword is required' });
  }

  let browser;
  try {
    console.log('🟡 Launching headless browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // ✅ Load cookies from file
    const cookiesPath = path.join(__dirname, '../cookies.json');
    if (!fs.existsSync(cookiesPath)) {
      throw new Error('cookies.json not found. Please run saveCookies.js first.');
    }

    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
    await page.setCookie(...cookies);
    console.log('✅ Cookies loaded');

    // ✅ Go to Twitter and check login status
    await page.goto('https://x.com/home', { waitUntil: 'networkidle2' });
    console.log('✅ Logged in session restored');

    // ✅ Go to Twitter Search page
    const searchURL = `https://x.com/search?q=${encodeURIComponent(keyword)}&src=typed_query&f=live`;
    console.log(`🔍 Navigating to: ${searchURL}`);
    await page.goto(searchURL, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000); // Give time to load tweets

    // ✅ Scrape tweet data
    console.log('🟡 Scraping tweets...');
    const tweets = await page.evaluate(() => {
      const tweetData = [];
      const twentyFourHoursAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
      const articles = document.querySelectorAll('article');

      articles.forEach(article => {
        const timeTag = article.querySelector('time');
        const handleSpan = article.querySelector('div[dir="ltr"] span');

        if (timeTag && handleSpan && timeTag.dateTime) {
          const tweetTime = new Date(timeTag.dateTime).getTime();
          if (tweetTime >= twentyFourHoursAgo) {
            tweetData.push({
              username: handleSpan.innerText.trim(),
              time: timeTag.dateTime,
            });
          }
        }
      });

      return tweetData;
    });

    console.log(`✅ Scraped ${tweets.length} tweets`);
    const uniqueUsers = [...new Set(tweets.map(t => t.username))];

    res.json({
      postCount: tweets.length,
      usernames: uniqueUsers,
    });

  } catch (err) {
    console.error('❌ Scraping failed:', err.message);
    res.status(500).json({
      msg: 'Scraping failed. Twitter may have blocked access or changed structure.',
      error: err.message,
    });
  } finally {
    if (browser) {
      console.log('🟡 Closing browser...');
      await browser.close();
    }
  }
});

module.exports = router;
