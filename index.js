import express from 'express';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

const app = express();
const port = process.env.PORT || 3000;

app.get('/extract-links', async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'A valid URL is required' });
    }

    try {
        // Launch Puppeteer using chrome-aws-lambda
        const browser = await puppeteer.launch({
            executablePath: await chrome.executablePath,
            args: chrome.args,
            headless: chrome.headless,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Extract all links
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => a.href);
        });

        await browser.close();

        res.json({ url, links });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch webpage', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
