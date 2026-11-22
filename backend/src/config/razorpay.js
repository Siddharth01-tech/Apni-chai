let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) return razorpayInstance;

  try {
    const Razorpay = require("razorpay");

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.warn("Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) not set in environment.");
      return null;
    }

    razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });

    return razorpayInstance;
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      console.warn("Razorpay package is not installed. Run 'npm install razorpay' when ready.");
      return null;
    }
    throw err;
  }
};

module.exports = {
  getRazorpayInstance,
};
