const express = require("express");
const {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  toggleUserStatus,
} = require("../controllers/admincontroller");
const { protect } = require("../middleware/authmiddleware");
const { adminOnly } = require("../middleware/adminmiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/orders", getAllOrders);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", toggleUserStatus);

module.exports = router;
