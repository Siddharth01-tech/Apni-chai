const express = require("express");
const {
  getRecommendations,
  getPairings,
} = require("../controllers/recommendationcontroller");

const router = express.Router();

router.get("/", getRecommendations);
router.get("/pairings", getPairings);

module.exports = router;
