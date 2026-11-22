const express = require("express");
const {
  createReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/reviewcontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.post("/", protect, createReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
