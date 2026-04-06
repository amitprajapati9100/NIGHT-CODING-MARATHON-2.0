import jwt from "jsonwebtoken";
import User from "../models/user-model.js";
import { ensureDatabaseConnection } from "../config/database-config.js";
import { getDatabaseErrorMessage, isDatabaseError } from "../utils/error-response-util.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    await ensureDatabaseConnection();

    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "development-secret",
      );
      const userId = decoded.userId || decoded.id;

      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  } catch (error) {
    console.error(error);
    if (isDatabaseError(error)) {
      return res.status(503).json({
        success: false,
        message: getDatabaseErrorMessage(error),
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};
