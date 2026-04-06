export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    ME: "/api/auth/me",
  },
  SESSION: {
    CREATE: "/api/sessions",
    GET_ALL: "/api/sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
  },
  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions",
    EXPLAIN: "/api/ai/generate-explanation",
  },
  QUESTION: {
    UPDATE: (id) => `/api/questions/${id}`,
  },
};
