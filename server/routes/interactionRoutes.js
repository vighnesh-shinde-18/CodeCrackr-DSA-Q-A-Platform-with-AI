const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllInteractions,
  getInteractionById,
  deleteInteractionById,
  clearAllInteractions,
  getInteractionByFeatureType
} = require("../controllers/InteractionControllers");

router.get("/", authMiddleware, getAllInteractions);
router.get("/by-feature", authMiddleware,getInteractionByFeatureType)
router.get("/:id", authMiddleware, getInteractionById);
router.delete("/:id", authMiddleware, deleteInteractionById);
router.delete("/", authMiddleware, clearAllInteractions);

module.exports = router;
