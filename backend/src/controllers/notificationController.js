const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Protected
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

    return successResponse(res, 200, 'Notifications retrieved', {
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('getNotifications error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Protected
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return errorResponse(res, 404, 'Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    return successResponse(res, 200, 'Notification marked as read', notification);
  } catch (error) {
    console.error('markAsRead error:', error);
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Protected
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    return successResponse(res, 200, 'All notifications marked as read');
  } catch (error) {
    console.error('markAllAsRead error:', error);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
