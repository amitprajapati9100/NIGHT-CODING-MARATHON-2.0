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
