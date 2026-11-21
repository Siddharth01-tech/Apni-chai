const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },

    images: {
      type: [String],
      default: [],
    },

    tasteNotes: {
      type: [String],
      default: [],
    },

    wouldRecommend: {
      type: Boolean,
      default: true,
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },

    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

reviewSchema.statics.calculateAverageRating = async function (productId) {
  if (!productId) return;

  const productObjectId =
    productId instanceof mongoose.Types.ObjectId
      ? productId
      : new mongoose.Types.ObjectId(productId.toString());

  const stats = await this.aggregate([
    {
      $match: {
        product: productObjectId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$product",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const Product = mongoose.model("Product");

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productObjectId, {
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
    });
  } else {
    await Product.findByIdAndUpdate(productObjectId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
