const express = require("express");
const upload = require("../middleware/uploadmiddleware");
const { uploadToCloudinary } = require("../config/cloudinary");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/single", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const folder = req.body.folder || "chaiva/uploads";
    const result = await uploadToCloudinary(req.file.buffer, folder);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Cloudinary single upload error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed.",
    });
  }
});

router.post("/multiple", protect, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided.",
      });
    }

    const folder = req.body.folder || "chaiva/uploads";
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully.",
      count: results.length,
      images: results.map((r) => ({
        url: r.secure_url,
        publicId: r.public_id,
      })),
    });
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Images upload failed.",
    });
  }
});

module.exports = router;
