import express from "express";

import {
  generateConceptExplanation,
  generateInterviewQuestions,
  regenerateQuestionAnswer,
} from "../controller/ai-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/generate-questions", protect, generateInterviewQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);
router.post("/regenerate-answer", protect, regenerateQuestionAnswer);

export default router;
