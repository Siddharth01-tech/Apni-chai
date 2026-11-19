const express = require("express");

const {
  addaddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  changePassword,
  deactivateAccount,
} = require("../controllers/usercontroller");

const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

// All user and address endpoints require authentication
router.use(protect);

// Profile & Preferences
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/preferences", updateUserPreferences);
router.put("/change-password", changePassword);
router.delete("/account", deactivateAccount);

// Delivery Address CRUD
router.post("/address", addaddress);
router.get("/address", getAddresses);
router.get("/address/:addressId", getAddressById);
router.put("/address/:addressId", updateAddress);
router.delete("/address/:addressId", deleteAddress);
router.patch("/address/:addressId/default", setDefaultAddress);

module.exports = router;
