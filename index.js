import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = process.env.PORT || 3000;

// API endpoint to extract links
app.get('/extract-links', async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Valid URL is required' });
    }

    try {
        // Launch puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the URL and wait for the full page load
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Extract all anchor tags with href
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(anchor => anchor.href);
        });

        await browser.close();

        // Respond with extracted links
        res.json({ url, links });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch webpage', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
