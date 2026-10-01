const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'gramacare_super_secret_jwt_key_2026_rural_health'
      );

      // Get user from the token without password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return errorResponse(res, 401, 'User account no longer exists');
      }

      if (!user.isActive) {
        return errorResponse(res, 403, 'User account has been deactivated. Please contact administrator.');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return errorResponse(res, 401, 'Not authorized, token verification failed');
    }
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized, no authentication token provided');
  }
};

module.exports = { protect };
