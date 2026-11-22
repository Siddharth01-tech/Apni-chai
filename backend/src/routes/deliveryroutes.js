const express = require("express");
const {
  getAssignedDeliveries,
  updateDeliveryStatus,
  recordDeliveryLocation,
} = require("../controllers/deliverycontroller");
const { protect } = require("../middleware/authmiddleware");
const { deliveryOnly } = require("../middleware/deliverymiddleware");

const router = express.Router();

router.use(protect);
router.use(deliveryOnly);

router.get("/assigned", getAssignedDeliveries);
router.patch("/order/:id/status", updateDeliveryStatus);
router.post("/location", recordDeliveryLocation);

module.exports = router;
