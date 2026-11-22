const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../controllers/ordercontroller");
const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/status", authorizeRoles("admin", "delivery"), updateOrderStatus);

module.exports = router;
