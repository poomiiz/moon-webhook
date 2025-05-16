require('dotenv').config();
const express = require('express');
const { db } = require('./firebaseClient');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MooMoon Webhook is running!');
});

app.post('/test-firestore', async (req, res) => {
  const mockUser = {
    userId: 'test_user',
    displayName: 'พี่โอม',
    coins: 99,
    power: 88,
    createdAt: new Date(),
  };
  await db.collection('users').doc('test_user').set(mockUser);
  res.send('✅ Firestore saved!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});