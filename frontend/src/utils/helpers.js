export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (/buffering timed out/i.test(error?.message || "")) {
    return "The backend database is not connected. Restart the backend after fixing MONGODB_URI in backend/.env.";
  }
  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  if (error?.message === "Network Error") {
    return "Unable to reach the server. Please check that the backend is running.";
  }
  if (error?.message) return error.message;
  return fallback;
};

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export const getInitials = (name = "Interview Prep") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

export const formatQuestionCount = (count = 0) =>
  `${count} question${count === 1 ? "" : "s"}`;

export const sortQuestions = (questions = []) =>
  [...questions].sort((first, second) => {
    if (first.isPinned !== second.isPinned) {
      return Number(second.isPinned) - Number(first.isPinned);
    }

    return new Date(first.createdAt) - new Date(second.createdAt);
  });

export const stripMarkdown = (content = "") =>
  content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const sanitizeAnswer = (content = "") =>
  content
    .replace(/\*\*How to answer well:\*\*[\s\S]*?(?=\n\s*```|$)/gi, "")
    .replace(/How to answer well:[\s\S]*?(?=\n\s*```|$)/gi, "")
    .replace(/Define the concept in simple language\.\s*/gi, "")
    .replace(/Walk through a practical implementation or debugging example\.\s*/gi, "")
    .replace(/End with the outcome,\s*trade-off,\s*or lesson learned\.\s*/gi, "")
    .replace(
      /```(?:js|javascript)?\s*const result = items\.filter\(Boolean\)\.map\(\(item\) => item\.trim\(\)\);\s*```/gi,
      "",
    )
    .replace(
      /const result = items\.filter\(Boolean\)\.map\(\(item\) => item\.trim\(\)\);/gi,
      "",
    )
    .replace(
      /```(?:js|javascript)?\s*const normalized = input\?\.trim\(\);\s*if \(!normalized\) throw new Error\('Invalid input'\);\s*```/gi,
      "",
    )
    .replace(
      /const normalized = input\?\.trim\(\);\s*if \(!normalized\) throw new Error\('Invalid input'\);/gi,
      "",
    )
    .trim();

export const getSummary = (content = "", maxLength = 170) => {
  const cleaned = stripMarkdown(sanitizeAnswer(content));
  if (!cleaned) return "Answer will appear here after generation.";
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trimEnd()}...`;
};

export const PASSWORD_RULE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

export const isStrongPassword = (password = "") =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

export const EMAIL_RULE = "Please enter a valid email address.";

export const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
