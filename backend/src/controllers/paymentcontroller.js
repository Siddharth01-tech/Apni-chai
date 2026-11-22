const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../models/payment");
const Order = require("../models/order");
const { getRazorpayInstance } = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { orderId } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Valid orderId is required.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized for this order payment.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This order has already been paid for.",
      });
    }

    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      const transactionId = `MOCK_TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const payment = await Payment.create({
        order: order._id,
        user: userId,
        transactionId,
        amount: order.totalAmount,
        currency: "INR",
        paymentMethod: order.paymentMethod === "cod" ? "cod" : "upi",
        paymentGateway: order.paymentMethod === "cod" ? "cod" : "razorpay",
        status: "pending",
      });

      return res.status(200).json({
        success: true,
        message: "Payment initialized.",
        mode: "simulated",
        payment,
      });
    }

    const options = {
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `rcpt_${order.orderNumber}`,
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const payment = await Payment.create({
      order: order._id,
      user: userId,
      transactionId: razorpayOrder.id,
      amount: order.totalAmount,
      currency: "INR",
      paymentMethod: "upi",
      paymentGateway: "razorpay",
      gatewayOrderId: razorpayOrder.id,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Create payment order error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to initialize payment.",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Valid orderId is required.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (key_secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed: Invalid signature.",
        });
      }
    }

    order.paymentStatus = "paid";
    if (order.orderStatus === "placed") {
      order.orderStatus = "confirmed";
    }
    await order.save();

    await Payment.findOneAndUpdate(
      { order: order._id },
      {
        status: "completed",
        gatewayOrderId: razorpay_order_id,
        gatewayPaymentId: razorpay_payment_id,
        gatewaySignature: razorpay_signature,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      order,
    });
  } catch (error) {
    console.error("Verify payment error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed.",
    });
  }
};

const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid orderId.",
      });
    }

    const payment = await Payment.findOne({ order: orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No payment record found for this order.",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payment record.",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentByOrderId,
};
