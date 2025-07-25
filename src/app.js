// app.js
const express = require('express');
require('dotenv').config();
const { verifyWebhook, handleWebhook } = require('./services/messenger');

const app = express();
app.use(express.json());

// Endpoint để Facebook verify
app.get('/webhook', verifyWebhook);

// Endpoint để nhận event
app.post('/webhook', handleWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy trên port ${PORT}`));
