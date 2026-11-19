const express = require("express");
const {
  addproduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  getSignatureChais,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
} = require("../controllers/productcontroller");

const { protect, authorizeRoles } = require("../middleware/authmiddleware");

const router = express.Router();

// Public routes (Frontend menu, storefront & details)
router.get("/", getAllProducts);
router.get("/signature", getSignatureChais);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin-only routes (Product Catalog Management)
router.post("/", protect, authorizeRoles("admin"), addproduct);
router.put("/:id", protect, authorizeRoles("admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);
router.patch("/:id/availability", protect, authorizeRoles("admin"), toggleProductAvailability);

module.exports = router;
