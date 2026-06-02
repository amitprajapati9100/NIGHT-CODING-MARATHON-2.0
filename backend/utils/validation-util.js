export const EMAIL_RULE = "Please enter a valid email address.";

export const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
