const { sendText } = require('../services/messenger');
const { getBotState, setBotState } = require('../services/state');
const { sendMacroNewsOnCommand } = require('../services/newsService');

function verifyWebhook(req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    return res.send(req.query['hub.challenge']);
  }
  return res.send('Xác thực thất bại 😢');
}

async function handleMessage(event) {
  const senderId = event.sender.id;
  const text = event.message.text?.toLowerCase();

  if (senderId !== process.env.USER_ID) return;

  if (text === 'on') {
    await setBotState(true);
    return sendText(senderId, '🤖 Bot Cofure đã BẬT.');
  }

  if (text === 'off') {
    await setBotState(false);
    return sendText(senderId, '💤 Bot Cofure đã TẮT.');
  }

  if (text === 'trạng thái') {
    const status = (await getBotState()) ? 'ĐANG BẬT ✅' : 'ĐANG TẮT ❌';
    return sendText(senderId, `🚦 Trạng thái bot: ${status}`);
  }

  if (text.includes('lịch')) {
    return sendMacroNewsOnCommand(text);
  }
}

module.exports = { verifyWebhook, handleMessage };
