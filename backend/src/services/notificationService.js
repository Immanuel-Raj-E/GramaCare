const Notification = require('../models/Notification');

const createNotification = async ({ userId, title, message, type = 'system' }) => {
  try {
    return await Notification.create({
      userId,
      title,
      message,
      type,
      isRead: false
    });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

module.exports = {
  createNotification
};
