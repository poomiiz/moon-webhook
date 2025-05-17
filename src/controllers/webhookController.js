const line = require('@line/bot-sdk');
const { decideReply } = require('../services/routerService');
const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

async function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const reply = await decideReply(event.source.userId, event.message.text);
    return client.replyMessage(event.replyToken, { type: 'text', text: reply });
  }
  return Promise.resolve(null);
}

module.exports = { handleEvent };
