const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // ใช้ถ้ามี .env (แต่ Doppler/railway ใช้ env ได้เหมือนกัน)

const app = express();
app.use(bodyParser.json());

// 🌙 MAIN WEBHOOK: ระบบหลัก (logic พื้นฐาน หรือเชื่อม Dialogflow/Booking)
app.post('/webhook', (req, res) => {
  console.log('MAIN WEBHOOK CALLED!', req.body);

  // ตัวอย่าง: ตอบกลับ Hello เฉย ๆ
  res.status(200).send('OK from main webhook');
});

// 🧠 AI WEBHOOK: ตอบ AI (GPT-4o/Together/Llama ฯลฯ)
app.post('/aiwebhook', async (req, res) => {
  try {
    console.log('AI WEBHOOK CALLED!', req.body);

    const events = req.body.events;
    if (!events) return res.sendStatus(200);

    for (let event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        // เรียก AI (ตัวอย่าง OpenAI GPT-4o)
        const userMsg = event.message.text;
        const aiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o', // หรือ gpt-3.5-turbo, llama, etc.
            messages: [{ role: 'user', content: userMsg }],
            max_tokens: 200
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const aiText = aiResponse.data.choices[0].message.content;

        // ตอบกลับ LINE OA ด้วยข้อความที่ AI ตอบ
        await axios.post(
          'https://api.line.me/v2/bot/message/reply',
          {
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: aiText }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.LINE_CHANNEL_TOKEN}`,
            },
          }
        );
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('AI webhook error:', err.message, err.response?.data);
    res.status(500).send('AI webhook error');
  }
});

// ROUTE เช็คชีวิตง่าย ๆ
app.get('/', (req, res) => {
  res.send('MooMoon API running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
