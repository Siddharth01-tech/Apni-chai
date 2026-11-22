const mongoose = require("mongoose");
const Order = require("../models/order");

const getAssignedDeliveries = async (req, res) => {
  try {
    const { status = "active", page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status === "active") {
      filter.orderStatus = { $in: ["confirmed", "preparing", "out_for_delivery"] };
    } else if (status === "completed") {
      filter.orderStatus = "delivered";
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
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
    console.error("Get assigned deliveries error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve deliveries.",
    });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;
    const { status, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const allowedStatuses = ["out_for_delivery", "delivered"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Delivery partners can only update status to 'out_for_delivery' or 'delivered'.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note: note || `Delivery updated to ${status}.`,
      changedAt: new Date(),
      changedBy: userId,
    });

    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Delivery status updated to ${status}.`,
      order,
    });
  } catch (error) {
    console.error("Update delivery status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update delivery status.",
    });
  }
};

const recordDeliveryLocation = async (req, res) => {
  try {
    const { orderId, latitude, longitude } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Valid orderId is required.",
      });
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Both latitude and longitude are required.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery coordinate recorded successfully.",
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        recordedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Record delivery location error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to record delivery coordinates.",
    });
  }
};

module.exports = {
  getAssignedDeliveries,
  updateDeliveryStatus,
  recordDeliveryLocation,
};
