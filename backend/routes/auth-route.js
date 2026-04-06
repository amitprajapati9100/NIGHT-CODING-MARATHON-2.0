import express from "express";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controller/auth-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

// Auth Routes
router.post("/signup", registerUser); // Register User

router.post("/login", loginUser); // Login User
router.get("/me", protect, getCurrentUser);

export default router;
