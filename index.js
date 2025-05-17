const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('Webhook called!', req.body); // ดู log ใน Railway ตอน deploy
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send('Hello from MooMoon Webhook!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
