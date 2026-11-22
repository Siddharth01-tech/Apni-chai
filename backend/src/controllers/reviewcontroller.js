const mongoose = require("mongoose");
const Review = require("../models/review");
const Product = require("../models/product");
const Order = require("../models/order");

const createReview = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId, orderId, rating, title, comment, tasteNotes, images, wouldRecommend } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required.",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating is required and must be between 1 and 5.",
      });
    }

    if (!comment || comment.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Comment must be at least 2 characters long.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this chai product.",
      });
    }

    let isVerifiedPurchase = false;
    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
        "items.product": productId,
        orderStatus: "delivered",
      });
      if (order) isVerifiedPurchase = true;
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId && mongoose.Types.ObjectId.isValid(orderId) ? orderId : undefined,
      rating: Number(rating),
      title: title?.trim() || "",
      comment: comment.trim(),
      tasteNotes: Array.isArray(tasteNotes) ? tasteNotes : [],
      images: Array.isArray(images) ? images : [],
      wouldRecommend: wouldRecommend !== undefined ? Boolean(wouldRecommend) : true,
      isVerifiedPurchase,
      status: "approved",
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a review for this product.",
      });
    }
    console.error("Create review error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit review.",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required.",
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { product: productId, status: "approved" };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews.",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID format.",
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const isOwner = review.user.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this review.",
      });
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review.",
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};
