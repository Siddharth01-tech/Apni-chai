const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    refundId: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["none", "pending", "processed", "failed"],
      default: "none",
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    refundedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet", "cod"],
      required: true,
    },

    paymentGateway: {
      type: String,
      enum: ["razorpay", "stripe", "cashfree", "paytm", "phonepe", "cod", "manual"],
      default: "razorpay",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
      index: true,
    },

    gatewayOrderId: {
      type: String,
      trim: true,
    },

    gatewayPaymentId: {
      type: String,
      trim: true,
      sparse: true,
    },

    gatewaySignature: {
      type: String,
      trim: true,
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },

    failureReason: {
      type: String,
      trim: true,
    },

    failureCode: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
    },

    refund: {
      type: refundSchema,
      default: () => ({}),
    },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ order: 1, createdAt: -1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ gatewayPaymentId: 1 }, { sparse: true });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
