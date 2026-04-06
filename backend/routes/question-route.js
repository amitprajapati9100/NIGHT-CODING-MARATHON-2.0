import express from "express";

import { updateQuestion } from "../controller/question-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.patch("/:id", protect, updateQuestion);

export default router;
