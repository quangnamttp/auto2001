require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const messengerService = require('./services/messenger');

const app = express();
app.use(bodyParser.json());

// Webhook xác minh & xử lý ở messengerService
app.get('/webhook', messengerService.verifyWebhook);
app.post('/webhook', messengerService.handleWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại https://auto2001.onrender.com`);
});
