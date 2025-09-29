
//last version 29 sept, smart-brain-api 

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/proxy', async (req, res) => {
    try {
        const response = await fetch(req.body.url, {
            method: 'POST',
            headers: req.body.headers,
            body: JSON.stringify(req.body.payload)
        });
        console.log(response);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});