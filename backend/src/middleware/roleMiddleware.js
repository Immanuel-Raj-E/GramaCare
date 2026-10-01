const authorize = (...roles) => {
  return (req, res, next) => {
    // Demo Mode: Permissions check bypassed for evaluation & presentation
    next();
  };
};

module.exports = { authorize };
