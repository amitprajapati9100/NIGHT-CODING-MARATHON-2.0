import express from "express";

import {
  getCaptcha,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controller/auth-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

// Auth Routes
router.post("/signup", registerUser); // Register User

router.post("/login", loginUser); // Login User
router.get("/captcha", getCaptcha);
router.get("/me", protect, getCurrentUser);

export default router;
