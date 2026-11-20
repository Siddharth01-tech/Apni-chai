const express = require("express");
const { sendOtp, verifyOtp, resendOtp } = require("../controllers/otpcontroller");

const router = express.Router();

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);
router.post("/resend", resendOtp);

module.exports = router;
