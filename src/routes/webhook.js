const express = require('express');
const { handleEvent } = require('../controllers/webhookController');
const router = express.Router();

router.post('/', async (req, res) => {
  await Promise.all(req.body.events.map(handleEvent));
  res.sendStatus(200);
});

module.exports = router;
