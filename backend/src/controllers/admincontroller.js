const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Payment = require("../models/payment");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      revenueStats,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({ isAvailable: true }),
      Order.countDocuments({ orderStatus: { $in: ["placed", "confirmed", "preparing"] } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics.",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    console.error("Admin get all orders error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders.",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -refreshTokenHash")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      users,
    });
  } catch (error) {
    console.error("Admin get all users error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users.",
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account is now ${user.isActive ? "active" : "inactive"}.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status.",
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  toggleUserStatus,
};
