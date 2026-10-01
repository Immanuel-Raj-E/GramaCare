const express = require('express');
const {
  sendMessage,
  getMessagesWithUser,
  getConversations
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:otherUserId', protect, getMessagesWithUser);

module.exports = router;
