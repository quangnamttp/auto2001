const fetch = require('node-fetch');
const {
  PAGE_ACCESS_TOKEN,
  VERIFY_TOKEN,
  USER_ID
} = require('../config');

// Xác minh webhook từ Facebook
function verifyWebhook(req, res) {
  const mode    = req.query['hub.mode'];
  const token   = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
}

// Hàm gửi tin nhắn
async function sendMessage(recipientId, messageText) {
  const url = `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  const payload = {
    recipient: { id: recipientId },
    message: { text: messageText }
  };
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

// Xử lý event từ Facebook
async function handleWebhook(req, res) {
  const body = req.body;
  if (body.object === 'page') {
    for (const entry of body.entry) {
      const event = entry.messaging[0];
      const senderId = event.sender.id;

      // Chỉ trả lời cho Anh Trương
      if (senderId !== USER_ID) continue;

      if (event.message && event.message.text) {
        const text = event.message.text.trim().toLowerCase();
        switch (text) {
          case 'on':
            await sendMessage(senderId, '✅ Đã bật bot rồi nhaaa. Cùng lướt sóng hôm nay thôi!');
            break;
          case 'off':
            await sendMessage(senderId, '❌ Bot đã tắt, nghỉ dưỡng một chút. Khi nào bạn cần thì gọi tớ liền nha!');
            break;
          case 'trạng thái':
            await sendMessage(senderId, '🤖 Hiện bot đang BẬT và hoạt động đúng chuẩn luôn á!');
            break;
          default:
            await sendMessage(senderId,
              '🎉 Hí lô Anh Trương! Cofure đã online 😎\n' +
              'Tớ là trợ lý giao dịch crypto vui tính của anh đây!\n' +
              'Gõ “on” để nhận tín hiệu & bản tin thị trường mỗi ngày nha 🚀'
            );
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
}

module.exports = {
  verifyWebhook,
  handleWebhook
};
