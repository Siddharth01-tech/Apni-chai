const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cart");
const { sendOrderConfirmationEmail } = require("../config/email");

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `AC-${timestamp}-${random}`;
};

const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      items,
      deliveryAddress,
      paymentMethod = "cod",
      notes,
    } = req.body;

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address (fullName, phone, houseNumber, street, city, state, postalCode) is required.",
      });
    }

    let orderItems = [];
    let subtotal = 0;

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
          return res.status(400).json({
            success: false,
            message: "Invalid product ID in order items.",
          });
        }

        const product = await Product.findById(item.product);
        if (!product || !product.isAvailable) {
          return res.status(404).json({
            success: false,
            message: `Product '${item.productName || item.product}' is unavailable.`,
          });
        }

        const selectedSize = (item.size || "medium").toLowerCase();
        const matchedSize = product.sizes.find(
          (s) => s.name.toLowerCase() === selectedSize
        );
        const unitPrice = matchedSize ? matchedSize.price : (product.sizes[0]?.price || 0);
        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        const itemTotal = unitPrice * quantity;

        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          productName: product.name,
          productImage: product.image || "",
          chaiType: product.chaiType,
          size: selectedSize,
          quantity,
          customization: item.customization || {},
          unitPrice,
          totalPrice: itemTotal,
        });
      }
    } else {
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Your cart is empty. Please add items before placing an order.",
        });
      }

      for (const item of cart.items) {
        const product = item.product;
        if (!product || !product.isAvailable) continue;

        const matchedSize = product.sizes.find(
          (s) => s.name.toLowerCase() === item.size.toLowerCase()
        );
        const unitPrice = matchedSize ? matchedSize.price : (product.sizes[0]?.price || 0);
        const itemTotal = unitPrice * item.quantity;

        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          productName: product.name,
          productImage: product.image || "",
          chaiType: product.chaiType,
          size: item.size,
          quantity: item.quantity,
          customization: item.customization || {},
          unitPrice,
          totalPrice: itemTotal,
        });
      }
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid available items found for this order.",
      });
    }

    const deliveryFee = subtotal >= 199 ? 0 : 25;
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: userId,
      items: orderItems,
      deliveryAddress: {
        fullName: deliveryAddress.fullName.trim(),
        phone: deliveryAddress.phone.trim(),
        houseNumber: deliveryAddress.houseNumber || "1",
        street: deliveryAddress.street.trim(),
        area: deliveryAddress.area?.trim() || "",
        city: deliveryAddress.city.trim(),
        state: deliveryAddress.state?.trim() || "State",
        postalCode: deliveryAddress.postalCode?.trim() || deliveryAddress.pinCode?.trim() || "000000",
      },
      deliveryType: "delivery",
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentMethod: paymentMethod === "online" ? "online" : "cod",
      paymentStatus: "pending",
      orderStatus: "placed",
      statusHistory: [
        {
          status: "placed",
          note: "Order placed by customer.",
          changedAt: new Date(),
          changedBy: userId,
        },
      ],
      notes: notes?.trim() || "",
    });

    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    if (req.user?.email) {
      sendOrderConfirmationEmail(req.user.email, order).catch((err) =>
        console.warn("Failed to send order confirmation email:", err.message)
      );
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order.",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments({ user: userId }),
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
    console.error("Get my orders error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your orders.",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format.",
      });
    }

    const order = await Order.findById(id).populate("user", "name email phone");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const isOwner = order.user._id.toString() === userId;
    const isStaff = req.user.role === "admin" || req.user.role === "delivery" || req.user.role === "delivery_partner";

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order details.",
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const isOwner = order.user.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this order.",
      });
    }

    if (!["placed", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in its current state ('${order.orderStatus}').`,
      });
    }

    order.orderStatus = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      note: reason || "Cancelled by customer.",
      changedAt: new Date(),
      changedBy: userId,
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order has been cancelled successfully.",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order.",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;
    const { status, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format.",
      });
    }

    const allowedStatuses = [
      "placed",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
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
      note: note || `Order status updated to ${status}.`,
      changedAt: new Date(),
      changedBy: userId,
    });

    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'.`,
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};
