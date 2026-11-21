const crypto = require("crypto");
const Otp = require("../models/otp");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * Generate 6-digit numeric OTP.
 */
const generateNumericOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate JWT tokens for OTP-based quick login.
 */
const generateAuthTokens = (user) => {
  const accessToken = jwt.sign(
    { role: user.role },
    process.env.JWT_ACCESS_SECRET || "chaiva_secret",
    {
      subject: user._id.toString(),
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    }
  );

  return { accessToken };
};

const sendOtp = async (req, res) => {
  try {
    const { email, phone, purpose = "login" } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required to send OTP.",
      });
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
    const normalizedPhone = phone ? phone.trim() : undefined;

    const query = { purpose };
    if (normalizedEmail) query.email = normalizedEmail;
    if (normalizedPhone) query.phone = normalizedPhone;

    // Delete any existing pending OTPs for this recipient & purpose
    await Otp.deleteMany(query);

    const otpCode = generateNumericOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    await Otp.create({
      email: normalizedEmail,
      phone: normalizedPhone,
      otp: otpCode,
      purpose,
      expiresAt,
    });

    console.log(`[Chaiva OTP] Code for ${normalizedEmail || normalizedPhone}: ${otpCode}`);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${normalizedEmail || normalizedPhone}. Valid for 5 minutes.`,
      // Expose OTP in development mode for easy API testing
      ...(process.env.NODE_ENV !== "production" && { devOtp: otpCode }),
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP.",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp, purpose = "login" } = req.body;

    if (!otp || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: "OTP code and email or phone are required.",
      });
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
    const normalizedPhone = phone ? phone.trim() : undefined;

    const query = {
      purpose,
      expiresAt: { $gt: new Date() },
      verified: false,
    };
    if (normalizedEmail) query.email = normalizedEmail;
    if (normalizedPhone) query.phone = normalizedPhone;

    const otpRecord = await Otp.findOne(query);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired or is invalid. Please request a new one.",
      });
    }

    // Rate limiting brute force attempts
    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    if (otpRecord.otp !== otp.trim()) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP code. Please try again.",
        remainingAttempts: 3 - otpRecord.attempts,
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // If purpose is 'login', automatically sign in or retrieve user
    if (purpose === "login") {
      const userQuery = normalizedEmail ? { email: normalizedEmail } : { phone: normalizedPhone };
      let user = await User.findOne(userQuery);

      if (user) {
        const { accessToken } = generateAuthTokens(user);
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshTokenHash;

        return res.status(200).json({
          success: true,
          message: "OTP verified successfully. Login successful.",
          accessToken,
          user: userObj,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      verified: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify OTP.",
    });
  }
};

const resendOtp = async (req, res) => {
  return await sendOtp(req, res);
};

module.exports = {
  sendOtp,
  verifyOtp,
  resendOtp,
};
