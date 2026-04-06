import cors from "cors";
import express from "express";

import "./config/env-config.js";
import {
  connectDB,
  ensureDatabaseConnection,
  isDatabaseConnected,
} from "./config/database-config.js";
import aiRoutes from "./routes/ai-route.js";
import authRoutes from "./routes/auth-route.js";
import questionRoutes from "./routes/question-route.js";
import sessionRoutes from "./routes/session-route.js";

const app = express();
const PORT = process.env.PORT || 9001;
const DATABASE_RETRY_DELAY_MS = 5000;
const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === "*") {
      return true;
    }

    if (allowedOrigin === origin) {
      return true;
    }

    // Support deploy-time wildcards such as https://*.vercel.app
    if (allowedOrigin.includes("*")) {
      const wildcardPattern = allowedOrigin
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*");

      return new RegExp(`^${wildcardPattern}$`).test(origin);
    }

    return false;
  });
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Interview Prep API is running",
    healthCheck: "/api/health",
  });
});

app.use("/api", async (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  try {
    await ensureDatabaseConnection();
    return next();
  } catch (error) {
    return next(error);
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Interview Prep API is running",
    databaseConnected: isDatabaseConnected(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/questions", questionRoutes);

app.use((error, req, res, next) => {
  if (error?.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  return next(error);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const startServer = async () => {
  while (!isDatabaseConnected()) {
    try {
      await connectDB();
    } catch (error) {
      console.error(
        "Database connection failed during startup. Retrying in 5 seconds:",
        error.message,
      );

      try {
        await new Promise((resolve) => {
          setTimeout(resolve, DATABASE_RETRY_DELAY_MS);
        });
      } catch {
        break;
      }
    }
  }

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
