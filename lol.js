


const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let client;
let isReady = false;

app.post('/init', async (req, res) => {
    if (client) {
        res.json({ status: 'Client already initialized' });
        return;
    }

    client = new Client();

    client.on('qr', async (qr) => {
        try {
            // Convert QR code to data URL
            const qrDataURL = await qrcode.toDataURL(qr);
            app.locals.qrCode = qrDataURL;
            console.log('QR Code received:', qr);
        } catch (err) {
            console.error('QR Code generation failed:', err);
        }
    });

    client.on('ready', () => {
        isReady = true;
        console.log('Client is ready!');
    });

    await client.initialize();
    res.json({ status: 'Initializing client' });
});

app.get('/qr', (req, res) => {
    const qrCode = app.locals.qrCode;
    if (qrCode) {
        res.json({ qrCode });
    } else {
        res.json({ error: 'QR code not available' });
    }
});

app.post('/send', async (req, res) => {
    const { number, message } = req.body;
    
    if (!isReady) {
        res.status(400).json({ error: 'Client not ready' });
        return;
    }

    try {
        const chatId = number.substring(1) + "@c.us";
        await client.sendMessage(chatId, message);
        res.json({ status: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});
const PORT = process.env.PORT || 3001;
console.log('Port');
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

