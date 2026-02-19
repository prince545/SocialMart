
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendMessage, getMessages, markMessagesRead } = require('../controllers/messageController');

router.post('/', auth, sendMessage);
router.get('/:userId', auth, getMessages);
router.put('/read/:senderId', auth, markMessagesRead);

module.exports = router;
