export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    CAPTCHA: "/api/auth/captcha",
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
    REGENERATE_ANSWER: "/api/ai/regenerate-answer",
  },
  QUESTION: {
    UPDATE: (id) => `/api/questions/${id}`,
  },
  THANKS: {
    SEND: "/api/thanks",
  },
};
