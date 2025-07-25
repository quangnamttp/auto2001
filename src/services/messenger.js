// services/messenger.js
const axios = require('axios');
const {
  PAGE_ACCESS_TOKEN,
  VERIFY_TOKEN,
  USER_ID
} = require('../config');

/**
 * Xác minh webhook từ Facebook
 */
function verifyWebhook(req, res) {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
}

/**
 * Gọi Facebook Send API
 */
async function callSendAPI(senderId, response) {
  try {
    await axios.post(
      'https://graph.facebook.com/v12.0/me/messages',
      { recipient: { id: senderId }, message: response },
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );
    console.log('✅ Message sent to', senderId);
  } catch (err) {
    console.error('❌ Send API error:', err.response?.data || err.message);
  }
}

/**
 * Xử lý tin nhắn text
 */
async function handleMessage(senderId, text) {
  if (senderId !== USER_ID) return;

  const msg = text.trim().toLowerCase();
  let response;

  switch (msg) {
    case 'on':
      response = { text: '✅ Đã bật bot rồi nhaaa. Cùng lướt sóng hôm nay thôi!' };
      break;
    case 'off':
      response = { text: '❌ Bot đã tắt, nghỉ dưỡng một chút. Khi nào bạn cần thì gọi tớ liền nha!' };
      break;
    case 'trạng thái':
      response = { text: '🤖 Hiện bot đang BẬT và hoạt động đúng chuẩn luôn á!' };
      break;
    default:
      response = {
        text:
          '🎉 Hí lô Anh Trương! Cofure đã online 😎\n' +
          'Tớ là trợ lý giao dịch crypto vui tính của anh đây!\n' +
          'Gõ “on” để nhận tín hiệu & bản tin thị trường mỗi ngày nha 🚀'
      };
  }

  await callSendAPI(senderId, response);
}

/**
 * Xử lý postback (nếu có)
 */
async function handlePostback(senderId, payload) {
  let response;
  if (payload === 'GET_STARTED') {
    response = { text: 'Chào bạn! Đây là menu chính của bot...' };
  }
  // Nếu bạn mở rộng payload khác, thêm logic ở đây
  await callSendAPI(senderId, response);
}

/**
 * Hàm chính xử lý webhook
 */
async function handleWebhook(req, res) {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        const senderId = event.sender.id;
        if (event.message && event.message.text) {
          handleMessage(senderId, event.message.text);
        } else if (event.postback) {
          handlePostback(senderId, event.postback.payload);
        }
      });
    });
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.sendStatus(404);
}

module.exports = {
  verifyWebhook,
  handleWebhook
};
