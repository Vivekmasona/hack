const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// Data storage
const DATA_FILE = 'data.json';

// POST endpoint to save data
app.post('/receive', (req, res) => {
    const { url, title, thumbnail } = req.body;

    if (url && title) {
        const newData = { url, title, thumbnail };

        // Save data to JSON file
        const existingData = fs.existsSync(DATA_FILE)
            ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
            : [];
        existingData.push(newData);
        fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));

        res.status(200).json({ message: 'Data received successfully', data: newData });
    } else {
        res.status(400).json({ error: 'Missing required fields' });
    }
});

// GET endpoint to view saved data
app.get('/view', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.status(200).json(data);
    } else {
        res.status(404).json({ error: 'No data found' });
    }
});

module.exports = app;
