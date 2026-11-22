const Product = require("../models/product");
const { getChaiRecommendations, getSimilarChais } = require("../services/mlservice");

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { limit = 4 } = req.query;

    const mlResult = await getChaiRecommendations({
      userId: userId || "guest",
      userPreferences: req.user?.preferences || {},
      limit: Number(limit),
    });

    if (mlResult.success && Array.isArray(mlResult.recommendations) && mlResult.recommendations.length > 0) {
      const recommendedProducts = await Product.find({
        $or: [
          { _id: { $in: mlResult.recommendations } },
          { slug: { $in: mlResult.recommendations } },
        ],
        isAvailable: true,
      });

      if (recommendedProducts.length > 0) {
        return res.status(200).json({
          success: true,
          source: "fastapi_ml_service",
          count: recommendedProducts.length,
          recommendations: recommendedProducts,
        });
      }
    }

    const fallbackProducts = await Product.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      source: "curated_fallback",
      count: fallbackProducts.length,
      recommendations: fallbackProducts,
    });
  } catch (error) {
    console.error("Get recommendations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chai recommendations.",
    });
  }
};

const getPairings = async (req, res) => {
  try {
    const { chaiType, productId } = req.query;

    const mlResult = await getSimilarChais({
      chaiType,
      productId,
      limit: 2,
    });

    if (mlResult.success && Array.isArray(mlResult.similar) && mlResult.similar.length > 0) {
      const pairedProducts = await Product.find({
        $or: [
          { _id: { $in: mlResult.similar } },
          { slug: { $in: mlResult.similar } },
        ],
        isAvailable: true,
      });

      if (pairedProducts.length > 0) {
        return res.status(200).json({
          success: true,
          source: "fastapi_ml_service",
          count: pairedProducts.length,
          pairings: pairedProducts,
        });
      }
    }

    const filter = { isAvailable: true };
    if (productId) filter._id = { $ne: productId };

    const fallbackPairings = await Product.find(filter)
      .limit(2);

    return res.status(200).json({
      success: true,
      source: "curated_fallback",
      count: fallbackPairings.length,
      pairings: fallbackPairings,
    });
  } catch (error) {
    console.error("Get pairings error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pairings.",
    });
  }
};

module.exports = {
  getRecommendations,
  getPairings,
};
