/**
 * Standard API Response Format as required by rules.md
 */

const successResponse = (res, statusCode = 200, message = 'Operation successful', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, statusCode = 400, message = 'Operation failed', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors && process.env.NODE_ENV === 'development') {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
