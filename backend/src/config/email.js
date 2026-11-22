let transporter = null;

const getEmailTransporter = () => {
  if (transporter) return transporter;

  try {
    const nodemailer = require("nodemailer");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials (EMAIL_USER, EMAIL_PASS) not configured in environment.");
      return null;
    }

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return transporter;
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      console.warn("nodemailer package is not installed. Run 'npm install nodemailer' when ready.");
      return null;
    }
    throw err;
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  const trans = getEmailTransporter();
  if (!trans) {
    console.log(`[Email Service - Simulated] To: ${to} | Subject: ${subject}`);
    return { success: false, message: "Email transporter not configured." };
  }

  return await trans.sendMail({
    from: process.env.EMAIL_FROM || `"Apni Chai" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

const sendOtpEmail = async (email, otp) => {
  return await sendEmail({
    to: email,
    subject: "Your Apni Chai Verification Code",
    text: `Your Apni Chai OTP verification code is: ${otp}. This code is valid for 5 minutes.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #20251F;">
        <h2>Apni Chai Verification</h2>
        <p>Your one-time verification code is:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #203F2D; margin: 16px 0;">
          ${otp}
        </div>
        <p>This code will expire in 5 minutes. Do not share this OTP with anyone.</p>
      </div>
    `,
  });
};

const sendOrderConfirmationEmail = async (email, order) => {
  return await sendEmail({
    to: email,
    subject: `Order Confirmation - #${order.orderNumber} | Apni Chai`,
    text: `Thank you for your order! Your order #${order.orderNumber} for ₹${order.totalAmount} has been received.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #20251F;">
        <h2>Order Received!</h2>
        <p>Order Number: <strong>#${order.orderNumber}</strong></p>
        <p>Total Amount: <strong>₹${order.totalAmount}</strong></p>
        <p>Status: <strong>${order.orderStatus}</strong></p>
        <p>Your freshly prepared chai is on its way soon.</p>
      </div>
    `,
  });
};

module.exports = {
  getEmailTransporter,
  sendEmail,
  sendOtpEmail,
  sendOrderConfirmationEmail,
};
