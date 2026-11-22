const jwt = require("jsonwebtoken");
const Order = require("../models/order");
const User = require("../models/user");

const setupDeliveryTracking = (io) => {
  if (!io) return;

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication token required for live tracking."));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.sub).select("_id role isActive");

      if (!user || !user.isActive) {
        return next(new Error("User account invalid or inactive."));
      }

      socket.user = {
        id: user._id.toString(),
        role: user.role,
      };

      next();
    } catch (err) {
      next(new Error("Invalid authentication credentials."));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_order_tracking", async ({ orderId }) => {
      try {
        if (!orderId) {
          return socket.emit("tracking_error", { message: "orderId is required." });
        }

        const order = await Order.findById(orderId).select("user orderStatus");
        if (!order) {
          return socket.emit("tracking_error", { message: "Order not found." });
        }

        const isOwner = order.user.toString() === socket.user.id;
        const isStaff = socket.user.role === "admin" || socket.user.role === "delivery" || socket.user.role === "delivery_partner";

        if (!isOwner && !isStaff) {
          return socket.emit("tracking_error", {
            message: "Unauthorized to track this order.",
          });
        }

        const roomName = `order_${orderId}`;
        socket.join(roomName);

        socket.emit("tracking_joined", {
          orderId,
          orderStatus: order.orderStatus,
        });
      } catch (err) {
        socket.emit("tracking_error", { message: err.message });
      }
    });

    socket.on("update_delivery_location", async ({ orderId, latitude, longitude, heading, speed }) => {
      try {
        const isDeliveryStaff =
          socket.user.role === "delivery" ||
          socket.user.role === "delivery_partner" ||
          socket.user.role === "admin";

        if (!isDeliveryStaff) {
          return socket.emit("tracking_error", {
            message: "Only authorized delivery partners can update location coordinates.",
          });
        }

        if (!orderId || latitude === undefined || longitude === undefined) {
          return socket.emit("tracking_error", {
            message: "orderId, latitude, and longitude are required.",
          });
        }

        const order = await Order.findById(orderId);
        if (!order) {
          return socket.emit("tracking_error", { message: "Order not found." });
        }

        const locationPayload = {
          orderId,
          latitude: Number(latitude),
          longitude: Number(longitude),
          heading: heading ? Number(heading) : null,
          speed: speed ? Number(speed) : null,
          updatedAt: new Date(),
        };

        const roomName = `order_${orderId}`;
        io.to(roomName).emit("delivery_location_update", locationPayload);
      } catch (err) {
        socket.emit("tracking_error", { message: err.message });
      }
    });

    socket.on("leave_order_tracking", ({ orderId }) => {
      if (orderId) {
        socket.leave(`order_${orderId}`);
      }
    });
  });
};

module.exports = {
  setupDeliveryTracking,
};
