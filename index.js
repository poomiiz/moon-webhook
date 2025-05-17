const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

const CHANNEL_ACCESS_TOKEN = '<<ใส่ LINE OA Channel Token>>';

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  if (!events) return res.sendStatus(200);

  for (let event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      await axios.post(
        'https://api.line.me/v2/bot/message/reply',
        {
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: 'Hello MooMoon!' }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
        }
      );
    }
  }
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Hello from MooMoon Webhook!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
