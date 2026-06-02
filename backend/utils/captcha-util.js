import crypto from "crypto";

const CAPTCHA_TTL_MS = 5 * 60 * 1000;

const getCaptchaSecret = () =>
  process.env.CAPTCHA_SECRET || process.env.JWT_SECRET || "dev-captcha-secret";

const signPayload = (payload) =>
  crypto
    .createHmac("sha256", getCaptchaSecret())
    .update(payload)
    .digest("hex");

export const generateCaptchaChallenge = () => {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  const answer = a + b;
  const issuedAt = Date.now();
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${answer}.${issuedAt}.${nonce}`;
  const signature = signPayload(payload);

  return {
    question: `${a} + ${b} = ?`,
    token: Buffer.from(`${payload}.${signature}`).toString("base64url"),
    expiresInMs: CAPTCHA_TTL_MS,
  };
};

export const verifyCaptchaChallenge = (token = "", answer = "") => {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [expectedAnswer, issuedAtRaw, nonce, signature] = decoded.split(".");
    const payload = `${expectedAnswer}.${issuedAtRaw}.${nonce}`;
    const expectedSignature = signPayload(payload);

    if (!signature || signature !== expectedSignature) return false;

    const issuedAt = Number.parseInt(issuedAtRaw, 10);
    if (!Number.isFinite(issuedAt)) return false;
    if (Date.now() - issuedAt > CAPTCHA_TTL_MS) return false;

    return expectedAnswer === `${String(answer).trim()}`;
  } catch {
    return false;
  }
};
