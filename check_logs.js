import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER_LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173');

    // Wait a moment for any async React errors
    await page.waitForTimeout(2000);

    await browser.close();
})();
