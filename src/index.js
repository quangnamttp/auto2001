const express = require('express');
const bodyParser = require('body-parser');
const { verifyWebhook, handleMessage } = require('./handlers/messageHandler');
const { startJobs } = require('./services/scheduler');

const app = express();
app.use(bodyParser.json());

app.get('/webhook', verifyWebhook);
app.post('/webhook', (req, res) => {
  req.body.entry.forEach(entry => {
    entry.messaging.forEach(event => {
      if (event.message) handleMessage(event);
    });
  });
  res.sendStatus(200);
});

app.get('/ping', (_, res) => res.send('pong 🐶'));
startJobs();

app.listen(process.env.PORT || 3000, () => console.log('Bot Cofure chạy rồi 🚀'));
