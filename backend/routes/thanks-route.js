import express from "express";
import { sendThanks } from "../controller/thanks-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", protect, sendThanks);

export default router;
