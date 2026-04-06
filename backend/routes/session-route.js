import express from "express";
import {
  createSession,
  getMySessions,
  getSessionById,
} from "../controller/session-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", protect, createSession);
router.post("/create", protect, createSession);
router.get("/", protect, getMySessions);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);

export default router;
