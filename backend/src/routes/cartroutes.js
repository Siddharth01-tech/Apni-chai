const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartcontroller");

const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

// All cart actions require customer authentication
router.use(protect);

router.route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route("/item/:itemId")
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;
