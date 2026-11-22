const express = require("express");
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentByOrderId,
} = require("../controllers/paymentcontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.use(protect);

router.post("/order", createPaymentOrder);
router.post("/verify", verifyPayment);
router.get("/order/:orderId", getPaymentByOrderId);

module.exports = router;
