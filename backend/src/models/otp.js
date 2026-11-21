const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["login", "register", "password_reset", "verify_phone"],
      default: "login",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ phone: 1, purpose: 1 });

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
