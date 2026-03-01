const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.on('pageerror', error => {
            console.log('\n--- PAGE ERROR ---');
            console.log(error.message);
        });

        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('\n--- CONSOLE ERROR ---');
                console.log(msg.text());
            }
        });

        console.log('Navigating to Home...');
        await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 10000 });
        await new Promise(r => setTimeout(r, 2000));

        console.log('Navigating to Explore...');
        await page.goto('http://localhost:5173/explore', { waitUntil: 'load', timeout: 10000 });
        await new Promise(r => setTimeout(r, 2000));

        await browser.close();
    } catch (e) {
        console.error('Script Failed:', e.message);
    }
})();
