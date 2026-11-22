const deliveryOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const allowedRoles = ["delivery", "delivery_partner", "admin"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access forbidden. Delivery partner privileges required.",
    });
  }

  next();
};

module.exports = {
  deliveryOnly,
};
