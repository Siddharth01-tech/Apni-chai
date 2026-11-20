const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file Buffer or local path to Cloudinary.
 * @param {Buffer|string} fileInput - Memory buffer or file path
 * @param {string} folder - Target Cloudinary folder (e.g. "chaiva/products")
 * @returns {Promise<object>} Upload result with secure_url and public_id
 */
const uploadToCloudinary = (fileInput, folder = "chaiva/uploads") => {
  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(fileInput)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(fileInput);
    } else {
      cloudinary.uploader.upload(
        fileInput,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    }
  });
};

/**
 * Delete a media asset from Cloudinary using its public_id.
 * @param {string} publicId
 * @returns {Promise<object>} Result
 */
const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
