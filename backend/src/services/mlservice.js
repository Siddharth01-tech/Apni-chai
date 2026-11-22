const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const getChaiRecommendations = async ({ userId, userPreferences = {}, limit = 4 }) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${ML_SERVICE_URL}/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        preferences: userPreferences,
        limit,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ML service responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      source: "ml_service",
      recommendations: data.recommendations || [],
    };
  } catch (err) {
    return {
      success: false,
      source: "fallback",
      error: err.message,
      recommendations: [],
    };
  }
};

const getSimilarChais = async ({ chaiType, productId, limit = 2 }) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${ML_SERVICE_URL}/similar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chai_type: chaiType,
        product_id: productId,
        limit,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ML service responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      source: "ml_service",
      similar: data.similar || [],
    };
  } catch (err) {
    return {
      success: false,
      source: "fallback",
      error: err.message,
      similar: [],
    };
  }
};

module.exports = {
  getChaiRecommendations,
  getSimilarChais,
};
