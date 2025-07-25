// app.js
require('dotenv').config();
const express = require('express');
const { verifyWebhook, handleWebhook } = require('./services/messenger');

const app = express();
app.use(express.json());

app.get('/webhook', verifyWebhook);
app.post('/webhook', handleWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
