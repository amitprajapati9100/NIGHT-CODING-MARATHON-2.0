import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(currentDir, "..");
const projectRoot = path.resolve(backendRoot, "..");
const IMPORTANT_ENV_KEYS = [
  "PORT",
  "CLIENT_URLS",
  "MONGODB_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "AI_REQUEST_TIMEOUT_MS",
];

const normalizeEnvValue = (value = "") => {
  const trimmedValue = value.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1).trim();
  }

  return trimmedValue;
};

dotenv.config({
  path: [
    path.join(backendRoot, ".env.local"),
    path.join(backendRoot, ".env"),
    path.join(projectRoot, ".env.local"),
    path.join(projectRoot, ".env"),
  ],
  quiet: true,
});

for (const envKey of IMPORTANT_ENV_KEYS) {
  const matchingKey = Object.keys(process.env).find(
    (key) => key.trim() === envKey,
  );

  if (!matchingKey) {
    continue;
  }

  process.env[envKey] = normalizeEnvValue(process.env[matchingKey]);

  if (matchingKey !== envKey) {
    delete process.env[matchingKey];
  }
}
