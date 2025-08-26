import express from "express";
import { summarizeText, suggestTitle } from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/summarize", summarizeText);
router.post("/title", suggestTitle);

export default router;
