const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Send a message
// @route   POST /api/messages
// @access  Protected
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message || !message.trim()) {
      return errorResponse(res, 400, 'Please provide receiver and message content');
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return errorResponse(res, 404, 'Recipient user not found');
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message: message.trim(),
      readStatus: false
    });

    // Notify receiver
    await createNotification({
      userId: receiverId,
      title: 'New Healthcare Message',
      message: `${req.user.name}: "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}"`,
      type: 'message'
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

    return successResponse(res, 201, 'Message sent successfully', populatedMessage);
  } catch (error) {
    console.error('sendMessage error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get message history between current user and another user
// @route   GET /api/messages/:otherUserId
// @access  Protected
const getMessagesWithUser = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

    // Mark unread messages from other user as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: req.user._id, readStatus: false },
      { readStatus: true }
    );

    return successResponse(res, 200, 'Messages retrieved', messages);
  } catch (error) {
    console.error('getMessagesWithUser error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get active conversations list
// @route   GET /api/messages/conversations
// @access  Protected
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

    // Extract unique conversation partners
    const partnersMap = new Map();

    messages.forEach((msg) => {
      const isSender = msg.senderId._id.equals(req.user._id);
      const partner = isSender ? msg.receiverId : msg.senderId;
      const partnerIdStr = partner._id.toString();

      if (!partnersMap.has(partnerIdStr)) {
        partnersMap.set(partnerIdStr, {
          partner,
          lastMessage: msg.message,
          lastMessageDate: msg.createdAt,
          unreadCount: !isSender && !msg.readStatus ? 1 : 0
        });
      } else if (!isSender && !msg.readStatus) {
        const existing = partnersMap.get(partnerIdStr);
        existing.unreadCount += 1;
      }
    });

    const conversations = Array.from(partnersMap.values());
    return successResponse(res, 200, 'Conversations retrieved', conversations);
  } catch (error) {
    console.error('getConversations error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  sendMessage,
  getMessagesWithUser,
  getConversations
};
