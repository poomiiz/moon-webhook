require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const line = require('@line/bot-sdk');
const webhookRouter = require('./routes/webhook');

const app = express();
app.use(bodyParser.json());
app.use('/webhook', line.middleware({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
}), webhookRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));
